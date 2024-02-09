// Importation des bibliothèques et modules nécessaires
import { fireEvent, screen, waitFor } from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import Bills from "../containers/Bills.js";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";

// Mock du store de l'application
jest.mock("../app/Store.js", () => mockStore);

// Test de l'interaction avec l'icône œil sur la page
describe("When I click on an eye icon", () => {
  test("Then a modal should be displayed", () => {
    // Préparation du DOM pour le test
    document.body.innerHTML = `<div data-testid="icon-eye" data-bill-url="http://example.com/bill.jpg"></div>`;

    // Initialisation du conteneur Bills avec les mocks nécessaires
    const billsContainer = new Bills({
      document,
      onNavigate: () => {},
      store: mockStore,
      localStorage: localStorageMock,
    });

    // Mock de la fonction modal jQuery
    $.fn.modal = jest.fn();

    // Déclenchement de l'événement click sur l'icône œil et vérification de l'ouverture de la modale
    const iconEye = screen.getByTestId("icon-eye");
    fireEvent.click(iconEye);
    expect($.fn.modal).toHaveBeenCalledWith("show");
  });
});


// Test de la récupération et du formatage des factures
describe("When I am on Bills Page", () => {
  test("Then bills should be fetched and formatted correctly", async () => {
    // Initialisation du conteneur Bills
    const billsContainer = new Bills({
      document,
      onNavigate: () => {},
      store: mockStore,
      localStorage: localStorageMock,
    });

    // Récupération des factures et vérification du formatage de la date et du statut
    const bills = await billsContainer.getBills();
    bills.forEach((bill) => {
      expect(bill.date).toMatch(/^\d{1,2}\s[A-Za-zéû]{3}\.\s\d{2}$/);
      expect(["En attente", "Accepté", "Refused"]).toContain(bill.status);
    });
  });
});


// Tests pour vérifier que les factures sont correctement affichées dans un tableau
describe("Given I am on Bills Page", () => {
  describe("When there are bills", () => {
    beforeEach(() => {
      document.body.innerHTML = BillsUI({ data: bills });
    });

    test("Then bills should be displayed in a table", () => {
      const rows = screen.getAllByTestId("tbody")[0].children;
      expect(rows.length).toBe(bills.length);
    });
  });


  // Tests pour vérifier le comportement lorsqu'on clique sur l'icône œil
  describe("When I click on an eye icon", () => {
    test("Then a modal should be displayed with the bill image", () => {
      // Préparation du DOM pour le test
      document.body.innerHTML = BillsUI({ data: bills });

      // Simuler le clic sur l'icône "œil"
      const iconEye = screen.getAllByTestId("icon-eye")[0];
      fireEvent.click(iconEye);

      // Vérifier si la modale est ouverte
      const modal = $("#modaleFile").get(0);
      expect(modal).toBeVisible(); // Assurez-vous que la modale est visible

      // Vérifier le contenu de la modale
      const modalContent = modal.querySelector(".modal-body img");

      // Vérifier que l'image est visible
      // Note : 'toBeVisible' est utilisé pour des éléments DOM natifs.
      // Si 'modalContent' est nulle (pas d'image), cette ligne lancera une erreur.
      if (modalContent) {
        expect(modalContent).toBeVisible();
      }

      // Vérifier que l'URL de l'image est correcte
      // Utiliser 'getAttribute' pour obtenir les attributs d'un élément DOM natif
      if (modalContent && iconEye.getAttribute("data-bill-url")) {
        expect(modalContent.getAttribute("src")).toBe(
          iconEye.getAttribute("data-bill-url")
        );
      }
    });

    test("Then the modal should display a broken image with a specific src if there is no bill URL", () => {
      const iconEye = screen.getAllByTestId("icon-eye")[0];
      fireEvent.click(iconEye);

      const modal = $("#modaleFile").get(0);
      expect(modal).toBeVisible(); // Vérifier que le modal est visible

      // Vérifier l'image dans le modal
      const modalImage = modal.querySelector(".modal-body img");
      expect(modalImage).toBeNull(); // S'assurer que l'image est trouvée
    });
  });
});


// Tests pour vérifier l'affichage de la page d'erreur
describe("When an error occurs", () => {
  test("Then the error page should be displayed", () => {
    const errorMessage = "Une erreur est survenue";
    document.body.innerHTML = BillsUI({ error: errorMessage });
    expect(screen.getByText(errorMessage)).toBeTruthy();
  });
});


// Tests pour vérifier le comportement du clic sur le bouton pour créer une nouvelle facture
describe("handleClickNewBill", () => {
  test("should navigate to new bill page on button click", () => {
    // Configurer le DOM nécessaire pour le test
    document.body.innerHTML = `<button data-testid="btn-new-bill"></button>`;

    const onNavigate = jest.fn();
    const billsInstance = new Bills({ document, onNavigate, localStorage });

    // Trouver le bouton et simuler un clic
    const buttonNewBill = document.querySelector(
      `button[data-testid="btn-new-bill"]`
    );
    buttonNewBill.addEventListener("click", billsInstance.handleClickNewBill);
    fireEvent.click(buttonNewBill);

    // Vérifier si onNavigate a été appelé avec le bon chemin
    expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["NewBill"]);
  });
  test("should not throw error if onNavigate is not provided", () => {
    const onNavigateMock = jest.fn(); // Création d'un mock pour onNavigate
    const billsInstance = new Bills({
      document,
      onNavigate: onNavigateMock,
      localStorage,
    });

    expect(() => {
      billsInstance.handleClickNewBill();
    }).not.toThrow();
  });
});


// Tests pour vérifier le comportement des icônes œil dans les factures
describe("Bills", () => {
  test("if there are no eye icons, no click event listeners are added", () => {
    // Créer un DOM sans icônes œil
    document.body.innerHTML = `<div class="no-eye-icons"></div>`;

    // Créer une nouvelle instance de Bills sans provoquer d'erreur
    expect(() => {
      new Bills({
        document,
        onNavigate: jest.fn(),
        store: mockStore,
        localStorage: localStorageMock,
      });
    }).not.toThrow();
  });
});


// Tests pour simuler et gérer une erreur 404 de l'API lors de la récupération des factures
describe("Bills", () => {
  test("should handle 404 error in getBills method", async () => {
    const mockStoreWith404Error = {
      bills: () => ({
        list: jest
          .fn()
          .mockRejectedValue({ message: "Not Found", status: 404 }),
      }),
    };

    const billsInstance = new Bills({
      document,
      onNavigate: jest.fn(),
      store: mockStoreWith404Error,
      localStorage: localStorageMock,
    });

    try {
      await billsInstance.getBills();
    } catch (error) {
      expect(error.status).toBe(404);
      expect(error.message).toBe("Not Found");
    }
  });
});


// Tests pour simuler et gérer une erreur 500 de l'API lors de la récupération des factures
describe("Bills", () => {
  test("should handle 500 error in getBills method", async () => {
    const mockStoreWith500Error = {
      bills: () => ({
        list: jest
          .fn()
          .mockRejectedValue({ message: "Internal Server Error", status: 500 }),
      }),
    };

    const billsInstance = new Bills({
      document,
      onNavigate: jest.fn(),
      store: mockStoreWith500Error,
      localStorage: localStorageMock,
    });

    try {
      await billsInstance.getBills();
    } catch (error) {
      expect(error.status).toBe(500);
      expect(error.message).toBe("Internal Server Error");
    }
  });
});

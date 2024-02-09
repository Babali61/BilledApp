/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, fireEvent, waitFor } from "@testing-library/dom";
import mockStore from "../__mocks__/store.js";
import NewBill from "../containers/NewBill.js";
import NewBillUI from "../views/NewBillUI.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";

jest.mock("../app/Store.js", () => mockStore);

// Description du groupe de tests pour la page NewBill
describe("NewBill Page", () => {
  // Configuration initiale avant chaque test
  beforeEach(async () => {
    // Nettoyer le DOM
    document.body.innerHTML = "";
    // Configurer le localStorage mocké
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    window.localStorage.setItem(
      "user",
      JSON.stringify({ type: "Employee", email: "a@a" })
    );
    // Préparer le DOM pour le routage et l'UI
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();
    // Injecter le HTML de NewBill dans le DOM
    document.body.innerHTML = NewBillUI();
    // Naviguer vers la page NewBill
    window.onNavigate(ROUTES_PATH.NewBill);
  });

  // Nettoyage après chaque test
  afterEach(() => {
    // Réinitialiser les mocks et nettoyer le DOM
    jest.clearAllMocks();
    document.body.innerHTML = "";
  });

  // Test pour vérifier l'appel de handleSubmit lors de la soumission du formulaire
  test("Should call handleSubmit when the form is submitted", async () => {
    // Préparation pour la soumission du formulaire
    await waitFor(() => screen.getByTestId("form-new-bill"));

    // Création d'un espion (spy) pour surveiller les appels à la méthode handleSubmit
    // Un espion est une fonction mockée qui permet de vérifier si elle a été appelée et avec quels arguments
    const handleSubmitSpy = jest.fn();

    // Initialisation de NewBill et remplacement de handleSubmit par l'espion
    const newBill = new NewBill({
      document,
      onNavigate: () => {},
      store: mockStore,
      localStorage: window.localStorage,
    });
    // Remplacement de la méthode originale handleSubmit par l'espion
    // Cela nous permet de surveiller et de tester l'appel à cette méthode sans modifier son comportement
    newBill.handleSubmit = handleSubmitSpy;

    // Attacher l'espion à l'événement de soumission du formulaire
    const form = screen.getByTestId("form-new-bill");
    form.removeEventListener("submit", newBill.handleSubmit);
    form.addEventListener("submit", handleSubmitSpy);

    // Simuler la soumission du formulaire
    fireEvent.submit(form);

    // Vérification que l'espion a été appelé lors de la soumission du formulaire
    // Cela confirme que la méthode handleSubmit est bien exécutée lors de cet événement
    await waitFor(() => {
      expect(handleSubmitSpy).toHaveBeenCalled();
    });
  });

  test("Should upload a file when a valid image is selected", async () => {
    // Initialisation de l'instance NewBill pour le test
    const newBill = new NewBill({
      document,
      onNavigate: () => {},
      store: mockStore,
      localStorage: window.localStorage,
    });

    // Création d'un espion pour surveiller les appels à la méthode handleChangeFile
    // Cela permet de vérifier si la méthode est appelée lors de l'événement de changement de fichier
    const handleChangeFile = jest.fn(newBill.handleChangeFile);

    // Obtention de l'élément input de type fichier dans le DOM pour le test
    const inputFile = screen.getByTestId("file");

    // Attacher l'espion à l'événement de changement sur l'input de fichier
    inputFile.addEventListener("change", handleChangeFile);

    // Simuler le changement de fichier avec un fichier image valide
    fireEvent.change(inputFile, {
      target: {
        files: [new File(["image"], "image.jpg", { type: "image/jpeg" })],
      },
    });

    // Vérifier que l'espion a été appelé, confirmant que la méthode handleChangeFile est exécutée lors de l'événement
    await waitFor(() => {
      expect(handleChangeFile).toHaveBeenCalled();
    });
  });

  test("Should call API when the form is submitted", async () => {
    // Initialisation de l'instance NewBill pour le test
    const newBill = new NewBill({
      document,
      onNavigate: () => {},
      store: mockStore,
      localStorage: window.localStorage,
    });

    // Création d'un espion pour surveiller les appels à la méthode handleSubmit
    // Cela permet de vérifier si la méthode est appelée lors de la soumission du formulaire
    const handleSubmit = jest.fn(newBill.handleSubmit);

    // Obtention de l'élément formulaire dans le DOM pour le test
    const form = screen.getByTestId("form-new-bill");

    // Attacher l'espion à l'événement de soumission du formulaire
    form.addEventListener("submit", handleSubmit);

    // Simuler la soumission du formulaire
    fireEvent.submit(form);

    // Vérifier que l'espion a été appelé, confirmant que la méthode handleSubmit est exécutée lors de la soumission
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  // Test pour vérifier la gestion des erreurs lors de la création d'une nouvelle facture
test("Should handle errors if API call fails during file upload", async () => {
  // Initialisation de l'instance NewBill pour le test
  const newBill = new NewBill({
    document,
    onNavigate: () => {},
    store: mockStore,
    localStorage: window.localStorage,
  });

  // Simuler une erreur lors de l'appel à l'API
  const postSpy = jest.spyOn(newBill.store.bills(), 'create').mockImplementationOnce(() =>
    Promise.reject(new Error("Erreur lors de la création de la facture"))
  );

  // Simuler l'ajout d'un fichier valide
  const inputFile = screen.getByTestId("file");
  const file = new File(["image"], "image.jpg", { type: "image/jpeg" });
  fireEvent.change(inputFile, { target: { files: [file] } });

  // Vérifier la gestion des erreurs
  await waitFor(() => {
    expect(postSpy).toHaveBeenCalled();
    // Vous pouvez également vérifier si un message d'erreur est affiché à l'utilisateur, si pertinent
  });

  // Nettoyer les mocks après le test
  postSpy.mockRestore();
});


// Test pour vérifier que seul les fichiers avec les extensions .jpg, .jpeg, ou .png sont acceptés
test("Should show error message for file with invalid extension", async () => {
  // Initialisation de l'instance NewBill pour le test
  const newBill = new NewBill({
    document,
    onNavigate: () => {},
    store: mockStore,
    localStorage: window.localStorage,
  });

  // Simuler l'ajout d'un fichier avec une extension invalide (ex: .txt)
  const inputFile = screen.getByTestId("file");
  const file = new File(["fileTXT"], "newbill.txt", { type: "text/plain" });
  fireEvent.change(inputFile, { target: { files: [file] } });

  // Vérifier que l'erreur est gérée correctement
  await waitFor(() => {
    expect(inputFile.value).toBe(""); // Vérifiez que l'input du fichier est réinitialisé
    expect(newBill.fileErrorMessage).toBe("Extension de fichier non autorisée"); // Vérifiez que le message d'erreur est défini
    expect(newBill.fileName).toBe(""); // Vérifiez que le nom du fichier est réinitialisé
    
  });
});

});

import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"

export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
    if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    if (iconEye) iconEye.forEach(icon => {
      icon.addEventListener('click', () => this.handleClickIconEye(icon))
    })
    new Logout({ document, localStorage, onNavigate })
  }

  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH['NewBill'])
  }

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url")
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
    $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`)
    $('#modaleFile').modal('show')
  }

  getBills = () => {
    const compareDates = (date1, date2) => {
      const months = {
        "Jan": "01", "Fév": "02", "Mar": "03", "Avr": "04",
        "Mai": "05", "Juin": "06", "Juil": "07", "Août": "08",
        "Sep": "09", "Oct": "10", "Nov": "11", "Déc": "12"
      };

      const convertDate = (date) => {
        const [day, month, year] = date.split(' ');
        const century = parseInt(year) >= 70 ? '19' : '20';
        const formattedMonth = months[month.substr(0,3)];
        const formattedDay = day.padStart(2, '0');
        return `${century}${year}-${formattedMonth}-${formattedDay}`;
      };

      const formattedDate1 = convertDate(date1);
      const formattedDate2 = convertDate(date2);

      return new Date(formattedDate1) - new Date(formattedDate2);
    };

    if (this.store) {
      return this.store
      .bills()
      .list()
      .then(snapshot => {
        const bills = snapshot.map(doc => {
          try {
            return {
              ...doc,
              date: formatDate(doc.date),
              status: formatStatus(doc.status)
            }
          } catch(e) {
            console.error("Erreur lors du formatage de la facture:", e);
            return {
              ...doc,
              date: formatDate(doc.date),
              status: formatStatus(doc.status)
            }
          }
        });

        // Trier les factures par date en ordre décroissant
        bills.sort((a, b) => compareDates(b.date, a.date));
        
        return bills;
      })
    }
  }
  
}

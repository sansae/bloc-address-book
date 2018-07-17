const inquirer = require('inquirer');
const ContactController = require("./ContactController");

module.exports = class MenuController {
  constructor() {
    this.mainMenuQuestions = [
      {
        type: "list",
        name: "mainMenuChoice",
        message: "Please choose from an option below: ",
        choices: [
          "Add new contact",
          "View all contacts",
          "Search for a contact",
          "Delete a contact",
          "Get date",
          "Exit"
        ]
      }
    ];

    this.book = new ContactController();
  }

  main() {
    console.log("Welcome to AddressBloc");
    inquirer.prompt(this.mainMenuQuestions).then((response) => {
      switch(response.mainMenuChoice) {
        case "Add new contact":
          this.addContact();
          break;
        case "View all contacts":
          this.getContacts();
          break;
        case "Search for a contact":
          this.search();
          break;
        case "Delete a contact":
          this.myDelete();
          break;
        case "Get date":
          this.getDateAndTime();
          break;
        case "Exit":
          this.exit();
          break;
        default:
          console.log("Invalid input");
          this.main();
      }
    })
    .catch(
      (err) => {
        console.log(err);
      }
    );
  }

  clear() {
    console.log("\x1Bc");
  }

  addContact() {
    this.clear();
    inquirer.prompt(this.book.addContactQuestions).then((answers) => {
      this.book.addContact(answers.name, answers.phone, answers.email).then((contact) => {
        console.log("Contact added successfully!");
        this.main();
      }).catch((err) => {
        console.log(err);
        this.main();
      });
    });
  }

  getContacts() {
    this.clear();

    this.book.getContacts().then((contacts) => {
      for (let contact of contacts) {
        console.log(`
          id: ${contact.id}
          name: ${contact.name}
          phone number: ${contact.phone}
          email: ${contact.email}
          ------------`
        );
      }
      this.main();
    }).catch((err) => {
      console.log(err);
      this.main();
    });
  }

  search() {
    this.clear();

    inquirer.prompt(this.book.searchForContactQuestions).then((answer) => {
      this.book.search(answer.name)
      .then((contact) => {
        if (contact === null) {
          this.clear();
          console.log(`
            contact not found
            -----------------\n`
          );
          this.main();
        } else {
          console.log(`
            contact found
            -------------`
          );
          this.showContact(contact);
        }
      })
      .catch((err) => {
        console.log(err);
        this.main();
      });
    });
  }

  myDelete() {
    this.clear();
    this.book.getContacts()
    .then((contacts) => {
      var contactIds = [];
      for (let contact of contacts) {
        contactIds.push(contact.id.toString());
        console.log(`
          id: ${contact.id}
          name: ${contact.name}
          phone number: ${contact.phone}
          email: ${contact.email}
          ------------`
        );
      }

      inquirer.prompt(this.book.deleteContactQuestions)
      .then((answer) => {
        if (answer.id === "N") {
          this.main();
          return;
        } else if (contactIds.includes(answer.id)) {
          this.book.delete(answer.id);
          console.log("contact deleted!\n");
          this.main();
        } else {
          this.myDelete();
        }
      })
    })
    .catch((err) => {
      console.log(err);
      this.main();
    });
  }

  delete(contact) {
    inquirer.prompt(this.book.deleteConfirmQuestions).then((answer) => {
      if (answer.confirmation) {
        this.book.delete(contact.id);
        console.log("contact deleted!");
        this.main();
      } else {
        console.log("contact not deleted");
        this.showContact(contact);
      }
    })
    .catch((err) => {
      console.log(err);
      this.main();
    });
  }

  showContact(contact) {
    this.clear();
    this._printContact(contact);
    inquirer.prompt(this.book.showContactQuestions)
    .then((answer) => {
      switch(answer.selected) {
        case "Delete contact":
          this.delete(contact);
          break;
        case "Main menu":
          this.main();
          break;
        default:
          console.log("Something went wrong.");
          this.showContact(contact);
      }
    })
    .catch((err) => {
      console.log(err);
      this.showContact(contact);
    });
  }

  _printContact(contact) {
    console.log(`
      id: ${contact.id}
      name: ${contact.name}
      phone number: ${contact.phone}
      email: ${contact.email}\n`
    );
  }

  exit() {
    console.log('Thanks for using AddressBloc!');
    process.exit();
  }

  checkTime(number) {
    if (number < 10) {
      number = "0" + number;
    }
    return number;
  }

  getTime() {
    var today = new Date();
    var hour = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    min = this.checkTime(min);
    sec = this.checkTime(sec);
    var amPm = hour >= 12 ? "PM" : "AM";
    if (hour === 0) {
      hour = 12;
    } else if (hour > 12) {
      hour = hour % 12;
    }

    return `${hour}:${min}:${sec}`;
  }

  getDate() {
    var date = new Date();
    const monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"];
    var month = monthNames[date.getMonth()];
    var day = date.getDate();
    var year = date.getFullYear();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    return `${month} ${day}, ${year}`;
  }

  getDateAndTime() {
    this.clear();
    console.log(`
      ${this.getDate()},
      ${this.getTime()}`
    );
    this.main();
  }

  remindMe() {
    return "Learning is a life-long pursuit";
  }

}

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
      this.book.addContact(answers.name, answers.phone).then((contact) => {
        console.log("Console added successfully!");
        this.main();
      }).catch((err) => {
        console.log(err);
        this.main();
      });
    });
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
    var day = date.getDay();
    var year = date.getFullYear();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    return `${month} ${day}, ${year}`;
  }

  getDateAndTime() {
    this.clear();
    console.log("getDate() called");
    console.log(`${this.getDate()}, ${this.getTime()}`);
    this.main();
  }

  remindMe() {
    return "Learning is a life-long pursuit";
  }
}

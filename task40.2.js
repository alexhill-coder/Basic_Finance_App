// Task 40.2 - The first variables initize the arrays to contain the income & expenses objects. The final variable
// contains a number used to calculate the percentage of the users final disposable income. 
let income = [];
let expenses = [];
let savings = 0;

// When the html is first loaded it checks to see if there is a session storage available and sets them up for use.
function myLoad() {

    // If there isn't a storage session of this name it means that this is the first time that it has been run.
    // It will then proceed to create the objects and set the variables as new session storage items.
    if (sessionStorage.getItem("hasCodeRunBefore") === null) {
        intialList();
        sessionStorage.setItem("incomeStreams", JSON.stringify(income));
        sessionStorage.setItem("allExpenses", JSON.stringify(expenses));
        sessionStorage.setItem("savings", savings);
        sessionStorage.setItem("hasCodeRunBefore", true);
    }
    
    // If a session storage is found then data should be available and the variables are restored with said data. 
    // Once set it only needs to be set again to store the information that has been added to the array/variable. 
    else {
        income = JSON.parse(sessionStorage.getItem("incomeStreams"));
        expenses = JSON.parse(sessionStorage.getItem("allExpenses"));
        savings = Number(sessionStorage.getItem("savings"));
    }

    // Creates the html prompts so the user can alter the data and to ensure that the data is restored before any manipulation
    // begins.
    userInterface();
}

// This is used to create both the income & expenses objects as they contain the same attributes it was unnecessary to create
// a second class. 
class accounts {

    constructor(name, amount, recurring, type) {

        this.name = name;
        this.amount = amount;
        this.recurring = recurring;
        this.type = type;

        // The function when called will determine which array to add the object to depending on the 
        // type property.
        this.addItem = function () {
            if (type == "income") {
                income.push(this);
            }
            else if (type == "expense") {
                expenses.push(this);
            }

            // Added in case of error during the creation. 
            else {
                console.log("Object Type Not Recognised");
            }
        }

    }
}

// This function will create the intial list if it is being run for the first time. As this information will be stored in the 
// session storage it was created to be used only once during first use to ensure multiple copies aren't created.
function intialList () {

    // Contains 5 arrays that will be turned into 'income' objects. 
    let incomes = [["Salery", 1200, true, "income"], ["Website", 90, true, "income"], ["Online Gigs", 45, false, "income"],
    ["Birthday", 20, false, "income"], ["Affliate", 27.25, false, "income"]];

    // Contains 5 arrays that will be turned into 'expenses' objects. 
    let expenses = [["Mortage", 200, true, "expense"], ["Electricity", 45, true, "expense"], ["Water Bill", 20, true, "expense"],
    ["Present", 35, false, "expense"], ["Shaver", 26.99, false, "expense"]];

    // foreach loops will go through each array and add the information to a function to be turned into an object.
    incomes.forEach(item => {
        accountObject(item[0], item[1], item[2], item[3]);
    });

    expenses.forEach(item => {
        accountObject(item[0], item[1], item[2], item[3]);
    });    
}


// Allows the user to enter information to create a new object. 
function userInput(type) {

    // Allows users to enter the name, payment/cost and whether it is recurring.
    let source = prompt("Please enter the name of the source:");
    let amount = prompt("Please enter the amount:");

    // A basic check to ensure a number is entered and will return the user to the main menu
    // if it isn't.
    if (isNaN(amount)) {
        return console.log(`It MUST be a number.`);
    }

    // The string is turned into a boolean providing the string is true or false.
    let recurring = JSON.parse(prompt("Please enter whether it is a regular payment, true or false:"));

    // A second check to ensure that the user has inputted the answer correctly. Creating a new object if successful.
    if (recurring == true || recurring == false) {
        accountObject (source, amount, recurring, type);
    } 

    // User feedback if the inputted answer is incorrect.
    else {
        console.log("Sorry but it must be a true or false answer.");
    }
    
}

// This function will create a new income or expense object depending on the option chosen in the prompt.
function accountObject (name, amount, recurring, type) {

    // Once created its function is immediatly called to add it to the correct array. 
    new accounts(name, amount, recurring, type).addItem();

    // If this is the first time it has been called the function will only create the objects
    // as the first session storage will be set immediatly by the program. 
    if (sessionStorage.getItem("hasCodeRunBefore") === null) {
        // do nothing. This is only to prevent it from performing any actions during it's intial set-up.
        // according to stackoverflow leaving a comment is all that is needed.
    }

    // Depending on which object is created the session storage is set to add the new object.
    else if (type == "income") {
        sessionStorage.setItem("incomeStreams", JSON.stringify(income));
    }
    else if (type == "expense") {
        sessionStorage.setItem("allExpenses", JSON.stringify(expenses));
    }
}

// Goes through the arrays and returns the total depending on the object type and whether it is a recurring payment.
// Takes income or expense as the type and true or false for the recurring parameter.
// Although not needed to split them up for the task, it provides more flexibility with the data.
function addRecurring(type, recurring) {

    // The variable that contains the total to be returned.
    let total = 0;

    // Returns a number based on whether it is recurring or a one off.
    if (type == "income") {
        income.forEach(source => {
            if (source.recurring == recurring) {
                total += Number(source.amount);
            }
        });
    }
    else if (type == "expense") {
        expenses.forEach(source => {
            if (source.recurring == recurring) {
                total += Number(source.amount);
            }
        });
    }

    return total;
}

// The user interface function contains the while loop and a series of prompts to allow the user to access the information
// and add to it. 
function userInterface() {

    //The first variable tells the switch statement which function to call.
    let userChoice = "";

    //Will continue to run unless 6 or a cancel is inputted on the first prompt.
    while(userChoice != "6"){  

        // These variables contain all the needed information to let the user know their balance.
        // Placed inside the loop to ensure that the values are updated when the user makes changes. 
        let totalIncome = addRecurring("income", true) + addRecurring("income", false);
        let totalexpenses = addRecurring("expense", true) + addRecurring("expense", false);
        let disposibleIncome = totalIncome - totalexpenses;
        let monthlySavings = (disposibleIncome * (Number(sessionStorage.getItem("savings")) / 100)).toFixed(2); 

        //The first prompt tells the user what each function does.
        userChoice = prompt("What would you like to do:\n1. Account Overview\n2. View/Add Income Items\n" +
        "3. View/Add Expense Items\n4. Amount to Save\n5. Current Disposable Income\n6. Quit?");
        
        //Provides the user with an overview of their finances.
        if(userChoice == "1"){

            //An alert that tells the user their total income, expenses, savings and disposable income for the month.
            alert(`\nMonthely Account Overview:` + 
            `\n\nRegular Incomes = £${(addRecurring("income", true)).toFixed(2)},\nOne-Off Payments = £${(addRecurring("income", false)).toFixed(2)},` +
            `\nTotal Income = £${totalIncome}\n` +
            `\nRegular Expenses = £${(addRecurring("expense", true)).toFixed(2)},\nOne-Off Payments = £${(addRecurring("expense", false)).toFixed(2)},` +
            `\nTotal Expenses = £${totalexpenses}\n` + `\nSavings = £${monthlySavings}\n` +
            `Disposable Income Available = £${disposibleIncome - monthlySavings}\n` +
            `------------------------------------------------------------------------`);
        }

        //Allows the user to view all the income objects from the prompt as a list and provides an option to add to it.
        // The list will then update as will the information from the other options.   
        else if(userChoice == "2"){

            // To ensure the prompt is properly formatted the message is created in this variable before being called
            // by the prompt.
            let message = "Do you wish to add to the list? y or n:" + "\n\nList of Income Sources:\n";
            income.forEach(source => {
                message += `\nSource of Income: ${source.name}, Amount: £${source.amount}, Regular Monthly Payment: ${source.recurring}\n`;
            });
            message += `\n------------------------------------------------------------------------` +
            `\n\nDo you wish to add to the list? y or n:`;
            
            // The prompt asks the user whether they want to add to the list and will provide additional prompts is yes.
            let addItem = prompt(message);

            if (addItem == "y") {
                userInput("income");
            }
        }
        
        //Allows the user to view all the expense objects from the prompt as a list and provides an option to add to it.
        // The list will then update as will the information from the other options.   
        else if(userChoice == "3"){

            let message = "Do you wish to add to the list? y or n:" + "\n\nList of Expense Sources:\n";
            expenses.forEach(source => {
                message += `\nSource of Expense: ${source.name}, Amount: £${source.amount}, Regular Monthly Payment: ${source.recurring}\n`;
            });
            
            message += `\n------------------------------------------------------------------------` +
            `\n\nDo you wish to add to the list? y or n:`;
            let addItem = prompt(message);

            if (addItem == "y") {
                userInput("expense");
            }
        }
        
        // Allows the user to select what perchentage of their disposable income will be kept as savings.
        else if(userChoice == "4"){

            //Updates the savings variable with the user input and updates the storage session to save the data.
            savings = Number(prompt(`Please select what perchentage you would like to save:`));
            sessionStorage.setItem("savings", savings);

            // User feedback to let the user know where they can see the results of this change.
            alert(`Please check out the Account Overview or Disposable Income section to see the results.`);
        }

        // Provdes the user with immediate feedback on how much of there disposable income is left. A full break down is shown in the 
        // Account Overview option.
        else if(userChoice == "5"){
            alert(`After Expenses and Savings You Have:\n\nThis Much Disposable Income Available = £${disposibleIncome - monthlySavings}\n`);
        }

        //Terminates the loop if called.
        else if(userChoice == "6"){
            console.log("Goodbye");
        }

        //Terminates the loop the prompt is cancelled on the main prompt.
        else if(userChoice == null){
            userChoice = "6";
        }
        
        //returns if the user enters anything other than the options provided.
        else{
            console.log("Oops - incorrect input\n");
            
        }
    }
}

// Used codippa website to learn how to turn a string into a boolean:
// https://codippa.com/how-to-convert-string-to-boolean-javascript/
// Used stackoverflow to learn what to do in the event of a blank statement:
// https://stackoverflow.com/questions/21528660/how-do-you-make-your-else-statement-do-nothing/21528735 
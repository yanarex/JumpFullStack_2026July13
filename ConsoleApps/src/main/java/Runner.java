import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

//Admin credentials: admin, admin123
//User credentials: .....................

public class Runner {
    static Scanner sc = new Scanner(System.in);

    static List<User> users = new ArrayList<>();

    static{
        User admin = new Admin();
        admin.setUsername("admin");
        admin.setPassword("admin123");

        User customer1 = new Customer();
        customer1.setUsername("rohit");
        customer1.setPassword("rohit123");

        User customer2 = new Customer();
        customer2.setUsername("mohit");
        customer2.setPassword("mohit123");

        User customer3 = new Customer();
        customer3.setUsername("shobhit");
        customer3.setPassword("shobhit123");

        users.add(admin);
        users.add(customer1); users.add(customer2); users.add(customer3);
    }

    /**
     * Entry point of the application.
     * Displays a welcome message, then repeatedly prompts the user to log in and
     * routes them to either the admin dashboard or the customer dashboard based
     * on their user type. After each session, asks the user if they want to
     * continue; entering "n" (case-insensitive) ends the program.
     *
     * @param args command-line arguments (not used)
     */
    public static void main(String[] args) {
        printMessage("Welcome to ABC Digital Bank");


        boolean flag = true;
        while(flag){
            User loginResult = login();

            if(loginResult == null){
                //exception-handling
                System.out.println("Invalid Credentials");
            }else if (loginResult.getUserType().equals("admin")){
                adminDashboard(loginResult);
            }else{
                customerDashboard(loginResult);
            }

            System.out.println("Do you want to continue? Press y/n");
            String mainLoopUserResponse = sc.nextLine();
            if(mainLoopUserResponse.equalsIgnoreCase("n")){
                flag = false;
            }
        }

    }

    /**
     * Displays the customer dashboard menu in a loop, letting the logged-in
     * customer view their account, withdraw, deposit, transfer funds, or log out.
     * Reads a menu choice (1-5) from standard input 
     * to the corresponding action method. Choosing "5. Exit" logs the user out
     * and returns immediately, ending the dashboard loop.
     *
     * @param user the currently logged-in customer whose dashboard is displayed
     */
    private static void customerDashboard(User user) {

        System.out.println("Welcome customer, " + user.getUsername());
        boolean flag = true;
        while (flag) {
            System.out.println("What would you like to do with your account?");

            System.out.println("1. View Account");
            System.out.println("2. Withdraw");
            System.out.println("3. Deposit");
            System.out.println("4. Transfer");
            System.out.println("5. Exit");
            int choice = Integer.parseInt(sc.nextLine());
        
            switch (choice) {
                case 1:
                    viewAccount(user);
                    break;
                case 2:
                    withdraw(user);
                break;
                case 3:
                    deposit(user);
                    break;
                case 4:
                    transfer(user);
                    break;
                case 5:
                    logout(user); 
                    flag = false;
                    return;
                default:
                    System.out.println("Invalid choice");
            }
        }
        System.out.println("Are you finished with your account? Press y/n");
        String userResponse = sc.nextLine();
        if (userResponse.equalsIgnoreCase("n")) {
            flag = false;
        }
    }
    

    /**
     * Prints the given user's checking and savings account IDs and balances
     * to standard output.
     *
     * @param user the user whose account details should be displayed
     */
    private static void viewAccount(User user) {
        System.out.println("Account details for: " + user.getUsername());
        System.out.println("Checking Account ID: " + user.getCheckingAccounts().getId());
        System.out.print("Balance: " + user.getCheckingAccounts().getBalance());
        System.out.println("Savings Account ID: " + user.getSavingsAccounts().getId());
        System.out.println("Balance: " + user.getSavingsAccounts().getBalance());
    }

    /**
     * Prompts the user to choose an account (checking or savings) and an amount,
     * then withdraws that amount from the selected account. If the requested
     * amount exceeds the account's balance, prints an insufficient-balance
     * message and returns without modifying the balance.
     *
     * @param user the user performing the withdrawal
     */
    private static void withdraw(User user) {
        System.out.println("Withdrawal for: " + user.getUsername());
        System.out.println("Which account would you like to withdraw from?");
        System.out.println("1. Checking Account");
        System.out.println("2. Savings Account");
        int choice = Integer.parseInt(sc.nextLine());

        switch (choice){
            case 1:
                System.out.println("Enter amount to withdraw from Checking Account:");
                double checkingAmount = Double.parseDouble(sc.nextLine());
                if (checkingAmount > user.getCheckingAccounts().getBalance()) {
                    System.out.println("Insufficient balance in Checking Account.");
                    return;
                }
                user.getCheckingAccounts().withdraw(checkingAmount);
                break;
            case 2:
                System.out.println("Enter amount to withdraw from Savings Account:");
                double savingsAmount = Double.parseDouble(sc.nextLine());
                if (savingsAmount > user.getSavingsAccounts().getBalance()) {
                    System.out.println("Insufficient balance in Savings Account.");
                    return;
                }
                user.getSavingsAccounts().withdraw(savingsAmount);
                break;
            default:
                System.out.println("Invalid choice");
        }
    }

    /**
     * Prompts the user to choose an account (checking or savings) and an amount,
     * then deposits that amount into the selected account.
     *
     * @param user the user performing the deposit
     */
    private static void deposit(User user) {
        System.out.println("Deposit for: " + user.getUsername());
        System.out.println("Which account would you like to deposit into?");
        System.out.println("1. Checking Account");
        System.out.println("2. Savings Account");
        int choice = Integer.parseInt(sc.nextLine());

        switch (choice){
            case 1:
                System.out.print("Enter amount to deposit into Checking Account: ");
                double checkingAmount = Double.parseDouble(sc.nextLine());
                user.getCheckingAccounts().deposit(checkingAmount);
                System.out.println("Deposit into Checking Account successful.");
                break;
            case 2:
                System.out.print("Enter amount to deposit into Savings Account: ");
                double savingsAmount = Double.parseDouble(sc.nextLine());
                user.getSavingsAccounts().deposit(savingsAmount);
                System.out.println("Deposit into Savings Account successful.");
                break;
            default:
                System.out.println("Invalid choice");
        }
    }

    /**
     * Prompts the user to choose a source account (checking or savings) and an
     * amount, then moves that amount from the source account to the opposite
     * account (checking -> savings, or savings -> checking). If the source
     * account has insufficient funds, prints an error message and returns
     * without transferring anything.
     *
     * @param user the user performing the transfer
     */
    private static void transfer(User user) {
        System.out.println("Which account would you like to transfer from?");
        System.out.println("1. Checking Account");
        System.out.println("2. Savings Account");

        int choice = Integer.parseInt(sc.nextLine());
        switch (choice){
            case 1:
                System.out.println("Enter amount to transfer from Checking Account: ");
                double checkingAmount = Double.parseDouble(sc.nextLine());

                if (checkingAmount > user.getCheckingAccounts().getBalance()) {
                    System.out.println("Insufficient balance in Checking Account.");
                    return;
                }

                user.getCheckingAccounts().withdraw(checkingAmount);
                user.getSavingsAccounts().deposit(checkingAmount);
                break;
            case 2:
                System.out.println("Enter amount to transfer from Savings Account: ");
                double savingsAmount = Double.parseDouble(sc.nextLine());
                if (savingsAmount > user.getSavingsAccounts().getBalance()) {
                    System.out.println("Insufficient balance in Savings Account.");
                    return;
                }

                user.getSavingsAccounts().withdraw(savingsAmount);
                user.getCheckingAccounts().deposit(savingsAmount);
                break;
            default:
                System.out.println("Invalid choice");
        }
    }

    /**
     * Logs the given user out by printing a logout confirmation message.
     * Does not modify any session state.
     *
     * @param user the user being logged out
     */
    private static void logout(User user) {
        System.out.println("Logging out user: " + user.getUsername());
    }

    /**
     * Displays the admin dashboard menu in a loop, letting the logged-in admin
     * view accounts, transfer funds, or log out. Reads a menu choice (1-3)
     * from standard input via {@code sc} and dispatches accordingly. Choosing
     * "3. Logout" logs the admin out and ends the dashboard loop.
     *
     * @param user the currently logged-in admin whose dashboard is displayed
     */
    private static void adminDashboard(User user) {
        System.out.println("Welcome admin");
        //todo: using switch-case present admin options
        //CRUD for customers, accounts etc
        boolean flag = true;
        while (flag) {
            System.out.println("What would you like to do?");
            System.out.println("1. View Accounts");
            System.out.println("2. Transfer Funds");
            System.out.println("3. Logout");

            int choice = Integer.parseInt(sc.nextLine());
            switch (choice){
                case 1:
                    System.out.println("Viewing accounts");
                    break;
                case 2:
                    System.out.println("Transferring funds");
                    break;
                case 3:
                    logout(user);
                    flag = false; // Exit the admin dashboard
                default:
                    System.out.println("Invalid choice");
            }
        }
    }

    

    /**
     * Prompts for a username and password (entered on one line, separated by a
     * space) and attempts to authenticate against the in-memory {@code users}
     * list, checking the hardcoded admin credentials first and then the
     * registered customers.
     *
     * @return the matching {@link User} if the credentials are valid, or
     *         {@code null} if no match is found
     */
    static User login(){
        User loginPerson = null;
        System.out.println("Please enter your username and password separated by a space");//rohit rohit123
        //validation
        String enteredUsernamePassword = sc.nextLine();
        String[] parts =enteredUsernamePassword.split(" ");
        String enteredUsername = parts[0];
        String entetedPassword = parts[1];
        for(int i=0; i<users.size(); i++){
            User user = users.get(i);
            if(enteredUsername.equals(user.getUsername()) && entetedPassword.equals(user.getPassword())){
                loginPerson = user;
                break;
                }
            }

        return loginPerson;
    }

    /**
     * Prints the given message to standard output.
     *
     * @param message the text to print
     */
    static void printMessage(String message){
        System.out.println(message);
    }
}

class Bank{
    private int id;
    private String name;
    private List<Customer> customers = new ArrayList<>();

    /**
     * Constructs a Bank with the given id, name, and list of customers.
     *
     * @param id        the bank's identifier
     * @param name      the bank's name
     * @param customers the list of customers belonging to this bank
     */
    public Bank(int id, String name, List<Customer> customers) {
        this.id = id;
        this.name = name;
        this.customers = customers;
    }

    /**
     * @return the bank's identifier
     */
    public int getId() {
        return id;
    }

    /**
     * Sets the bank's identifier.
     *
     * @param id the new identifier
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * @return the bank's name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the bank's name.
     *
     * @param name the new name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the list of customers belonging to this bank
     */
    public List<Customer> getCustomers() {
        return customers;
    }

    /**
     * Sets the list of customers belonging to this bank.
     *
     * @param customers the new list of customers
     */
    public void setCustomers(List<Customer> customers) {
        this.customers = customers;
    }
}

abstract class User{
    private String username;
    private String password;
    private Account checkingAccount = new CheckingAccount();
    private Account savingsAccount = new SavingsAccount();

    /**
     * @return this user's username
     */
    public String getUsername() {
        return username;
    }

    /**
     * Sets this user's username.
     *
     * @param username the new username
     */
    public void setUsername(String username) {
        this.username = username;

    }

    /**
     * @return this user's checking account
     */
    public Account getCheckingAccounts() {
        return checkingAccount;
    }

    /**
     * @return this user's savings account
     */
    public Account getSavingsAccounts() {
        return savingsAccount;
    }

    /**
     * @return this user's password
     */
    public String getPassword() {
        return password;
    }

    /**
     * Sets this user's password.
     *
     * @param password the new password
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * @return a string identifying the type of user (e.g. "admin" or "customer")
     */
    abstract String getUserType();
}

class Admin extends User{
    /**
     * @return the string "admin", identifying this user as an admin
     */
    String getUserType() {
        return "admin";
    }
}

class Customer extends User{
    /**
     * @return the string "customer", identifying this user as a customer
     */
    String getUserType() {
        return "customer";
    }
}



abstract class Account{
    private int id;
    private double balance;

    /**
     * Creates a new account with a randomly generated 5-digit id (between
     * 10000 and 99999) and an initial balance of 0.0.
     */
    protected Account() {
        this.id = 10000 + (int)(Math.random() * 90000);
        this.balance = 0.0;
    }

    /**
     * @return this account's id
     */
    public int getId() {
        return id;
    }

    /**
     * @return this account's current balance
     */
    public double getBalance() {
        return balance;
    }

    /**
     * Sets this account's balance directly.
     *
     * @param balance the new balance
     */
    public void setBalance(double balance) {
        this.balance = balance;
    }

    /**
     * Deposits the given amount into this account, increasing the balance and
     * printing a confirmation message. If the amount is not positive, prints
     * an error message instead and leaves the balance unchanged.
     *
     * @param amount the amount to deposit; must be greater than 0
     */
    public void deposit(double amount) {
        if (amount > 0) {
            setBalance(getBalance() + amount);
            System.out.println("Deposited " + amount + " to Checking Account. New balance: " + getBalance());
        } else {
            System.out.println("Deposit amount must be positive.");
        }

    }
    
    /**
     * Withdraws the given amount from this account, decreasing the balance and
     * printing a confirmation message, provided the amount is positive and no
     * greater than the current balance. Otherwise prints an error message and
     * leaves the balance unchanged.
     *
     * @param amount the amount to withdraw; must be greater than 0 and less
     *               than or equal to the current balance
     */
    public void withdraw(double amount) {
        if (amount > 0 && amount <= getBalance()) {
            setBalance(getBalance() - amount);
            System.out.println("Withdrew " + amount + " from Checking Account. New balance: " + getBalance());
        } else {
            System.out.println("Invalid withdrawal amount.");
        }

    }
}

class CheckingAccount extends Account implements AccountOperations{
    /**
     * No-op placeholder implementation required by {@link AccountOperations}.
     * Actual deposit logic lives in {@link Account#deposit(double)}.
     */
    @Override
    public void deposit() {
    }

    /**
     * No-op placeholder implementation required by {@link AccountOperations}.
     * Actual withdrawal logic lives in {@link Account#withdraw(double)}.
     */
    @Override
    public void withdraw() {
       
    }

    /**
     * No-op placeholder implementation required by {@link AccountOperations}.
     * Transfers are currently handled externally in {@code Runner.transfer}.
     */
    @Override
    public void transfer() {

    }
    //getinterestRate()// 1%

}

class SavingsAccount extends Account implements AccountOperations{
    /**
     * No-op placeholder implementation required by {@link AccountOperations}.
     * Actual deposit logic lives in {@link Account#deposit(double)}.
     */
    @Override
    public void deposit() {

    }

    /**
     * No-op placeholder implementation required by {@link AccountOperations}.
     * Actual withdrawal logic lives in {@link Account#withdraw(double)}.
     */
    @Override
    public void withdraw() {

    }

    /**
     * No-op placeholder implementation required by {@link AccountOperations}.
     * Transfers are currently handled externally in {@code Runner.transfer}.
     */
    @Override
    public void transfer() {

    }
    //getinterestRate()// 2%
}

/**
 * Defines the basic banking operations an account type must support:
 * depositing, withdrawing, and transferring funds.
 */
interface AccountOperations{
    void deposit();
    void withdraw();
    void transfer();
}

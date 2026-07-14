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

    private static void customerDashboard(User user) {

        System.out.println("Welcome customer, " + user.getUsername());
        boolean flag = true;
        while (flag) {
            System.out.println("What would you like to do with your account?");
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }

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
    

    private static void viewAccount(User user) {
        System.out.println("Account details for: " + user.getUsername());
        System.out.println("Checking Account ID: " + user.getCheckingAccounts().getId());
        System.out.print("Balance: " + user.getCheckingAccounts().getBalance());
        System.out.println("Savings Account ID: " + user.getSavingsAccounts().getId());
        System.out.println("Balance: " + user.getSavingsAccounts().getBalance());
    }

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

    private static void logout(User user) {
        System.out.println("Logging out user: " + user.getUsername());
    }

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

    

    static User login(){
        User loginType = null;
        System.out.println("Please enter your username and password separated by a space");//rohit rohit123
        //validation
        String enteredUsernamePassword = sc.nextLine();
        String[] parts =enteredUsernamePassword.split(" ");
        String enteredUsername = parts[0];
        String entetedPassword = parts[1];

        if(enteredUsername.equals("admin") && entetedPassword.equals("admin123")){
            loginType = users.get(0);
        }else{
            for(int i=0; i<users.size(); i++){
                User user = users.get(i);
                if(enteredUsername.equals(user.getUsername()) && entetedPassword.equals(user.getPassword())){
                    loginType = user;
                    break;
                }
            }
        }

        return loginType;
    }

    static void printMessage(String message){
        System.out.println(message);
    }
}

class Bank{
    private int id;
    private String name;
    private List<Customer> customers = new ArrayList<>();

    public Bank(int id, String name, List<Customer> customers) {
        this.id = id;
        this.name = name;
        this.customers = customers;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Customer> getCustomers() {
        return customers;
    }

    public void setCustomers(List<Customer> customers) {
        this.customers = customers;
    }
}

abstract class User{
    private String username;
    private String password;
    private Account checkingAccount = new CheckingAccount();
    private Account savingsAccount = new SavingsAccount();

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;

    }

    public Account getCheckingAccounts() {
        return checkingAccount;
    }

    public Account getSavingsAccounts() {
        return savingsAccount;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    abstract String getUserType();
}

class Admin extends User{
    String getUserType() {
        return "admin";
    }
}

class Customer extends User{
    String getUserType() {
        return "customer";
    }
}



abstract class Account{
    private int id;
    private double balance;

    protected Account() {
        this.id = 10000 + (int)(Math.random() * 90000);
        this.balance = 0.0;
    }

    public int getId() {
        return id;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public void deposit(double amount) {
        if (amount > 0) {
            setBalance(getBalance() + amount);
            System.out.println("Deposited " + amount + " to Checking Account. New balance: " + getBalance());
        } else {
            System.out.println("Deposit amount must be positive.");
        }

    }
    
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
    @Override
    public void deposit() {
    }

    @Override
    public void withdraw() {
       
    }

    @Override
    public void transfer() {

    }
    //getinterestRate()// 1%

}

class SavingsAccount extends Account implements AccountOperations{
    @Override
    public void deposit() {

    }

    @Override
    public void withdraw() {

    }

    @Override
    public void transfer() {

    }
    //getinterestRate()// 2%
}

interface AccountOperations{
    void deposit();
    void withdraw();
    void transfer();
}


export default class Customer {
  constructor({
    username = "",
    userType = "CUSTOMER",
    checkingAccount = null,
    savingsAccount = null,
  } = {}) {
    this.username = username;
    this.userType = userType;
    this.checkingAccount = checkingAccount;
    this.savingsAccount = savingsAccount;
  }

  get totalBalance() {
    return (
      Number(this.checkingAccount?.balance || 0) +
      Number(this.savingsAccount?.balance || 0)
    );
  }
}

def add(num1: int, num2: int):
    """Returns the sum of two integers."""
    return num1 + num2


def subtract(num1: int, num2: int):
    """Returns the difference of two integers."""
    return num1 - num2

def multiply(num1: int, num2: int):
    """Returns the product of two integers."""
    return num1 * num2

def divide(num1: int, num2: int):
    """Returns the quotient of two integers."""
    if num2 == 0:
        raise ValueError("Cannot divide by zero.")
    return num1 / num2

class BankAccount():
    def __init__(self, initial_balance=0):
        self.balance = initial_balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient funds.")
        self.balance -= amount

    def collect_interest(self):
        self.balance *= 1.1
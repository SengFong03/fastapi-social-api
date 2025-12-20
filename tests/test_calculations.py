import pytest
from app.calculations import add, subtract, multiply, divide, BankAccount


@pytest.fixture
def zero_bank_account():
    print("Creating zero balance bank account")
    return BankAccount()

@pytest.fixture
def bank_account():
    return BankAccount(50)

@pytest.mark.parametrize("num1, num2, expected", [
    (1, 2, 3),
    (5, 3, 8),
    (4, 3, 7),
    (10, 2, 12),
])
def test_add(num1, num2, expected):
    print("testing add function")
    assert add(num1, num2) == expected

def test_subtract():
    print("testing subtract function")
    assert subtract(5, 3) == 2

def test_multiply():
    print("testing multiply function")
    assert multiply(4, 3) == 12

def test_divide():
    print("testing divide function")
    assert divide(10, 2) == 5
    try:
        divide(10, 0)
    except ValueError as e:
        assert str(e) == "Cannot divide by zero."




def test_bank_set_initial_amount(bank_account):
    assert bank_account.balance == 50

def test_bank_default_initial_amount(zero_bank_account):    # run fixture function before test
    print("testing default initial amount")
    assert zero_bank_account.balance == 0

def test_bank_deposit(bank_account):
    bank_account.deposit(50)
    assert bank_account.balance == 100

def test_bank_withdraw(bank_account):
    bank_account.withdraw(30)
    assert bank_account.balance == 20

def test_bank_collect_interest(bank_account):
    bank_account.collect_interest()
    assert round(bank_account.balance, 6) == 55

@pytest.mark.parametrize("deposits, withdrawals, expected", [
    (100, 50, 50),
    (200, 80, 120),
    (50, 20, 30)
])
def test_bank_transactions(zero_bank_account, deposits, withdrawals, expected):
    zero_bank_account.deposit(deposits)
    zero_bank_account.withdraw(withdrawals)
    assert zero_bank_account.balance == expected


def test_bank_withdraw_insufficient_funds(bank_account):
    with pytest.raises(ValueError):
        bank_account.withdraw(100)
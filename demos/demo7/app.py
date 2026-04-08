# Demo 7 — Python app
# A minimal Flask-style "math service" used to demonstrate CI/CD

def add(a: float, b: float) -> float:
    return a + b


def subtract(a: float, b: float) -> float:
    return a - b


def multiply(a: float, b: float) -> float:
    return a * b


def divide(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b


def main():
    print("Math Service")
    print(f"  add(2, 3)      = {add(2, 3)}")
    print(f"  subtract(10,4) = {subtract(10, 4)}")
    print(f"  multiply(3, 7) = {multiply(3, 7)}")
    print(f"  divide(15, 3)  = {divide(15, 3)}")


if __name__ == "__main__":
    main()

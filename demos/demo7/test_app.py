import pytest
from app import add, subtract, multiply, divide


class TestAdd:
    def test_positive_numbers(self):
        assert add(2, 3) == 5

    def test_negative_numbers(self):
        assert add(-1, -1) == -2

    def test_mixed(self):
        assert add(-1, 3) == 2

    def test_floats(self):
        assert add(1.5, 2.5) == 4.0


class TestSubtract:
    def test_basic(self):
        assert subtract(10, 4) == 6

    def test_negative_result(self):
        assert subtract(3, 7) == -4


class TestMultiply:
    def test_basic(self):
        assert multiply(3, 7) == 21

    def test_by_zero(self):
        assert multiply(5, 0) == 0


class TestDivide:
    def test_basic(self):
        assert divide(15, 3) == 5.0

    def test_float_result(self):
        assert divide(10, 3) == pytest.approx(3.333, rel=1e-2)

    def test_divide_by_zero(self):
        with pytest.raises(ValueError, match="Cannot divide by zero"):
            divide(1, 0)

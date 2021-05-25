import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';

class BudgetInput extends Component {
  state = {
    newBudget: {
      income: [
        {
          name: '',
          amount: null,
        },
      ],
      expenses: [
        {
          name: '',
          amount: null,
        },
      ],
    },
    type: null,
  };

  getInputValue = (e) => {
    const val = e.target.value;
    this.setState({ type: val });
  };

  inputNameHandler = (e) => {
    const value = e.target.value;
    let newState;
    if (this.state.type === 'income') {
      this.setState((prevState) => {
        newState = {
          ...prevState,
          newBudget: {
            ...prevState.newBudget,
            income: { name: value },
          },
        };
        return newState;
      });
      console.log(this.state.newBudget);
    } else if (this.state.type === 'expenses') {
      this.setState((prevState) => {
        newState = {
          ...prevState,
          newBudget: { ...prevState.newBudget, expenses: { name: value } },
        };
        return newState;
      });
    }
  };

  addBudgetAmount = (e) => {
    const value = parseInt(e.target.value);
    if (this.state.type === 'income') {
      this.setState((prevState) => ({
        ...prevState,
        newBudget: {
          ...prevState.newBudget,
          income: {
            ...prevState.newBudget.income,
            amount: value,
          },
        },
      }));
    } else if (this.state.type === 'expenses') {
      this.setState((prevState) => ({
        ...prevState,
        newBudget: {
          ...prevState.newBudget,
          expenses: {
            ...prevState.newBudget.expenses,
            amount: value,
          },
        },
      }));
    }
  };

  addNewBudget = (e) => {
    this.props.onSave({ ...this.state });
    e.target.name.value = '';
    e.target.amount.value = '';
    e.target.budget.value = '';
    e.preventDefault();
  };

  render() {
    return (
      <div>
        <form onSubmit={this.addNewBudget} autoComplete="off">
          <div>
            <label for="budget">
              <strong>Input budget:</strong>
            </label>
            <select
              className="m-2"
              onChange={this.getInputValue}
              name="budget"
              autoFocus
            >
              <option className="p-2" value="">
                {' '}
                --{' '}
              </option>
              <option value="income">Income</option>
              <option value="expenses">Expenses</option>
            </select>
            <input
              type="text"
              className={'m-2'}
              placeholder={
                this.state.type === null
                  ? '--'
                  : this.state.type === 'income'
                  ? 'Income'
                  : 'Expenses'
              }
              name="name"
              onChange={this.inputNameHandler}
            />
            <input
              type="number"
              name="amount"
              className={'m-2'}
              placeholder="Amount"
              onChange={this.addBudgetAmount}
            />
            <button type="submit" className="btn btn-warning m-2">
              Add
            </button>
          </div>
        </form>

        <hr />
      </div>
    );
  }
}

export default BudgetInput;

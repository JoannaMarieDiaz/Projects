import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Expenses from './Component/Expenses/Expenses';
import Income from './Component/Income/Income';
import BudgetInput from './Component/BudgetInput/BudgetInput';

class BudgetApp extends Component {
  state = {
    budget: {
      income: [
        {
          id: 0,
          name: null,
          amount: null,
        },
      ],
      expenses: [
        {
          id: 0,
          name: null,
          amount: null,
        },
      ],
    },
    nextId: 1,
    total: 0,
    type: null,
    render: false,
  };

  addNewBudgetHandler = (newBudget) => {
    this.setState({ render: true });
    let newState;
    if (newBudget.type === 'income') {
      const income = newBudget.newBudget.income;
      this.setState((prevState) => {
        newState = {
          ...prevState,
          budget: {
            ...prevState.budget,
            income: [
              ...prevState.budget.income,
              {
                id: this.state.nextId,
                name: income.name,
                amount: income.amount,
              },
            ],
          },
        };
        return newState;
      });
    } else if (newBudget.type === 'expenses') {
      const expenses = newBudget.newBudget.expenses;
      this.setState((prevState) => {
        newState = {
          ...prevState,
          budget: {
            ...prevState.budget,
            expenses: [
              ...prevState.budget.expenses,
              {
                id: this.state.nextId,
                name: expenses.name,
                amount: expenses.amount,
              },
            ],
          },
        };
        return newState;
      });
    }
    let budgetId = this.state.nextId + 1;
    this.setState({ nextId: budgetId });
  };

  getIncomeTotal = () => {
    let total = 0;
    this.state.budget.income.map((amount) => (total += amount.amount));
    return total;
  };

  getExpensesTotal = () => {
    let total = 0;
    this.state.budget.expenses.map((amount) => (total += amount.amount));
    return total;
  };

  getTotal = () => {
    let total = 0;
    const incTotal = this.state.budget.income
      .map((inc) => inc.amount)
      .reduce((a, b) => a + b, 0);
    const decTotal = this.state.budget.expenses
      .map((exp) => exp.amount)
      .reduce((a, b) => a + b, 0);
    return (total = incTotal - decTotal);
  };

  onDelete = (id, type) => {
    let newState;
    if (type === 'income') {
      const budget = this.state.budget.income.filter((r) => r.id !== id);
      console.log('click!');
      this.setState((prevState) => {
        newState = {
          ...prevState,
          budget: {
            ...prevState.budget,
            income: budget,
          },
        };
        return newState;
      });
    } else if (type === 'expenses') {
      const budget = this.state.budget.expenses.filter((r) => r.id !== id);
      this.setState((prevState) => {
        newState = {
          ...prevState,
          budget: {
            ...prevState.budget,
            expenses: budget,
          },
        };
        return newState;
      });
    }
  };

  render() {
    const income = this.state.budget.income
      .filter((i) => i.id !== 0)
      .map((list, i) => {
        return {
          ...(
            <Income key={i} income={list} del={this.onDelete} type="income" />
          ),
        };
      });
    const expense = this.state.budget.expenses
      .filter((i) => i.id !== 0)
      .map((list, i) => {
        return {
          ...(
            <Expenses
              key={i}
              expenses={list}
              del={this.onDelete}
              type="expenses"
            />
          ),
        };
      });

    return (
      <div className="container">
        <div className="m-5">
          <h1>Budget List</h1>
          <BudgetInput onSave={this.addNewBudgetHandler} />
          <div className="d-flex">
            <div className="p-4 card w-50 m-3">
              <h2 className="text-success mb-3">Income</h2>
              <ul>
                <div className="ms-10 pb-2">
                  {this.state.render === true ? income : ''}
                </div>
                <hr />
                <h4>
                  <strong>Total: </strong> <span> {this.getIncomeTotal()}</span>
                </h4>
              </ul>
            </div>

            <div className="p-4 card w-50 m-3">
              <h2 className="text-warning mb-3">Expenses</h2>
              <ul>
                <div className="ms-10 pb-2">
                  {this.state.render === true ? expense : ''}
                </div>
                <hr />
                <h4>
                  <strong>Total: </strong>{' '}
                  <span> {this.getExpensesTotal()}</span>
                </h4>
              </ul>
            </div>
          </div>
          <div className="m-2">
            <h2>
              Budget Left:{' '}
              <span>
                <strong
                  className={
                    this.getTotal() < 1 ? 'text-danger' : 'text-success'
                  }
                >
                  {this.getTotal()}
                </strong>
              </span>
            </h2>
          </div>
        </div>
      </div>
    );
  }
}

export default BudgetApp;

import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import style from './Expenses.module.css';

const expenses = (props) => {
  const { name, amount, id } = props.expenses;

  return (
    <React.Fragment>
      <div className="m-4">
        <li key={id}>
          <strong>{name}: </strong>
          <span>{amount}</span>
          <button
            onClick={() => props.del(id, props.type)}
            className="btn btn-danger p-1 btn-sm"
            style={{ float: 'right' }}
          >
            <i className="fas fa-trash" style={{ height: '5px' }}></i>
          </button>
        </li>
      </div>
    </React.Fragment>
  );
};

export default expenses;

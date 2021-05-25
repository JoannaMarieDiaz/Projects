import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const income = (props) => {
  const { name, amount, id } = props.income;

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
            <i className="fas fa-trash w-15" style={{ height: '5px' }}></i>
          </button>
        </li>
      </div>
    </React.Fragment>
  );
};

export default income;

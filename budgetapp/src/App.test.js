import { render, screen } from '@testing-library/react';
import BudgetApp from './BudgetApp';

test('renders learn react link', () => {
  render(<BudgetApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

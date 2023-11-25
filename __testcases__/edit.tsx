import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditFile from './EditFile'; // Assuming the component is in the same directory

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

const fileMock = { id: 'fileId', name: 'example.txt' };

test('renders EditFile component', () => {
  render(<EditFile isOpen={true} onClose={() => {}} file={fileMock} />);
  
});

test('submits form and triggers file edit on valid input', async () => {
  const onCloseMock = jest.fn();

  // Mock the fetch function
  global.fetch = jest.fn().mockResolvedValueOnce({ status: 200 });

  render(<EditFile isOpen={true} onClose={onCloseMock} file={fileMock} />);

  expect(screen.getByLabelText('Name')).toHaveValue(fileMock.name);

  // Modify input field
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'newFileName' } });

  // Submit the form
  fireEvent.click(screen.getByText('Edit'));

  // Wait for the asynchronous operation to complete
  await waitFor(() => {
    expect(onCloseMock).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(`/api/files/${fileMock.id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: 'newFileName' }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // want to check if router.refresh() is called
  });
});

test('closes modal on cancel button click', () => {
  const onCloseMock = jest.fn();

  render(<EditFile isOpen={true} onClose={onCloseMock} file={fileMock} />);

  fireEvent.click(screen.getByText('Cancel'));

  expect(onCloseMock).toHaveBeenCalled();
  // You may want to check if the form is not submitted in this case
});

test('disables submit button when input is empty or unchanged', () => {
  const onCloseMock = jest.fn();

  render(<EditFile isOpen={true} onClose={onCloseMock} file={fileMock} />);

  const editButton = screen.getByText('Edit');

  expect(editButton).toBeDisabled();

  fireEvent.change(screen.getByLabelText('Name'), { target: { value: '' } });
  expect(editButton).toBeDisabled();

  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'example.txt' } });
  expect(editButton).toBeDisabled();

  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'newFileName' } });
  expect(editButton).not.toBeDisabled();
});

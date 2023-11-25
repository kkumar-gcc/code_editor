import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteFile from './DeleteFile'; // Assuming the component is in the same directory

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

const fileMock = { id: 'fileId', name: 'example.txt' };

test('renders DeleteFile component', () => {
  render(<DeleteFile isOpen={true} onClose={() => {}} file={fileMock} />);
  
});

test('submits form and triggers file deletion on confirmation', async () => {
  const onCloseMock = jest.fn();

  // Mock the fetch function
  global.fetch = jest.fn().mockResolvedValueOnce({ status: 200 });

  render(<DeleteFile isOpen={true} onClose={onCloseMock} file={fileMock} />);

  expect(screen.getByText('Do you really want to delete this file?')).toBeInTheDocument();

  fireEvent.click(screen.getByText('Delete'));

  await waitFor(() => {
    expect(onCloseMock).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(`/api/files/${fileMock.id}`, {
      method: 'DELETE',
    });
    
  });
});

test('closes modal on cancel button click', () => {
  const onCloseMock = jest.fn();

  render(<DeleteFile isOpen={true} onClose={onCloseMock} file={fileMock} />);

  fireEvent.click(screen.getByText('Cancel'));

  expect(onCloseMock).toHaveBeenCalled();
  // want to check if the form is not submitted in this case
});

test('displays error message on failed deletion', async () => {
  const onCloseMock = jest.fn();

  // Mock the fetch function to simulate an error
  global.fetch = jest.fn().mockResolvedValueOnce({ status: 500 });

  render(<DeleteFile isOpen={true} onClose={onCloseMock} file={fileMock} />);

  fireEvent.click(screen.getByText('Delete'));

  await waitFor(() => {
    expect(onCloseMock).not.toHaveBeenCalled();
    expect(screen.getByText('An error occurred while deleting the file.')).toBeInTheDocument();
  });
});

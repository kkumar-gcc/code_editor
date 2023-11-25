import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewFile from './NewFile'; // Assuming the component is in the same directory

// Mock the useRouter hook
jest.mock('next/router', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

// Mock the fetch function
global.fetch = jest.fn();

const parentIdMock = 'parentFolderId';

test('renders NewFile component', () => {
  render(<NewFile isOpen={true} onClose={() => {}} parentId={parentIdMock} />);

});

test('submits form and triggers file upload on valid input', async () => {
  const onCloseMock = jest.fn();

  render(<NewFile isOpen={true} onClose={onCloseMock} parentId={parentIdMock} />);

  const fileInput = screen.getByLabelText('File');
  const nameInput = screen.getByLabelText('Name');
  const uploadButton = screen.getByText('Upload');

  // Mock a file selection
  const file = new File(['file content'], 'example.txt', { type: 'text/plain' });
  fireEvent.change(fileInput, { target: { files: [file] } });

  // Wait for file input to update
  await waitFor(() => {
    expect(fileInput.files).toHaveLength(1);
  });

  fireEvent.click(uploadButton);

  // Wait for the asynchronous operation to complete
  await waitFor(() => {
    expect(onCloseMock).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(`/api/files/${parentIdMock}`, {
      method: 'POST',
      body: expect.any(FormData),
    });
    // want to check if router.refresh() is called
  });
});

test('closes modal on cancel button click', () => {
  const onCloseMock = jest.fn();

  render(<NewFile isOpen={true} onClose={onCloseMock} parentId={parentIdMock} />);

  fireEvent.click(screen.getByText('Cancel'));

  expect(onCloseMock).toHaveBeenCalled();
});

test('displays error message on failed file upload', async () => {
  const onCloseMock = jest.fn();

  // Mock the fetch function to simulate an error
  global.fetch = jest.fn().mockResolvedValueOnce({ status: 500 });

  render(<NewFile isOpen={true} onClose={onCloseMock} parentId={parentIdMock} />);

  fireEvent.click(screen.getByText('Upload'));

  // Wait for the asynchronous operation to complete
  await waitFor(() => {
    expect(onCloseMock).not.toHaveBeenCalled();
    expect(screen.getByText('an error occurred while uploading the file')).toBeInTheDocument();
  });
});

test('displays error message when file is not selected', async () => {
  const onCloseMock = jest.fn();

  render(<NewFile isOpen={true} onClose={onCloseMock} parentId={parentIdMock} />);

  fireEvent.click(screen.getByText('Upload'));

  // Wait for the asynchronous operation to complete
  await waitFor(() => {
    expect(onCloseMock).not.toHaveBeenCalled();
    expect(screen.getByText('please select a file')).toBeInTheDocument();
  });
});

test('displays error message when file name is not entered', async () => {
  const onCloseMock = jest.fn();

  render(<NewFile isOpen={true} onClose={onCloseMock} parentId={parentIdMock} />);

  const fileInput = screen.getByLabelText('File');

  // Mock a file selection
  const file = new File(['file content'], 'example.txt', { type: 'text/plain' });
  fireEvent.change(fileInput, { target: { files: [file] } });

  fireEvent.click(screen.getByText('Upload'));

  // Wait for the asynchronous operation to complete
  await waitFor(() => {
    expect(onCloseMock).not.toHaveBeenCalled();
    expect(screen.getByText('name is a required field')).toBeInTheDocument();
  });
});

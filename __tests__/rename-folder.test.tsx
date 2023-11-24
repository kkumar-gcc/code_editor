import React from 'react'
import {render, fireEvent, waitFor} from '@testing-library/react'
import EditFolder from '../src/components/folders/edit'
import {UseDisclosureProps} from '@nextui-org/use-disclosure'
import fetchMock from 'jest-fetch-mock'
import {useRouter} from 'next/navigation'

fetchMock.enableMocks()

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({refresh: jest.fn()}),
}))

jest.mock('next/link', () => {
  return ({children}: {children: React.ReactNode}) => {
    return <>{children}</>
  }
})

describe('EditFolder component', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('renders edit folder modal and handles form submission', async () => {
    const mockOnClose = jest.fn()
    const mockFolder = {id: 'clonucbtt0008fodshvfo6mcg', name: 'Case'}
    const props: UseDisclosureProps & {folder: any | null} = {
      isOpen: true,
      onClose: mockOnClose,
      folder: mockFolder,
    }

    const {getByLabelText, getByText} = render(<EditFolder {...props} />)

    expect(getByText('Edit the folder')).toBeInTheDocument()
    expect(getByLabelText('Name')).toBeInTheDocument()

    const nameInput = getByLabelText('Name')
    fireEvent.change(nameInput, {target: {value: 'New Folder Name'}})

    const submitButton = getByText('Edit folder')
    fireEvent.click(submitButton)

    const folder = {
      name: 'New Folder Name',
    }

    fetchMock.mockResponseOnce(
      JSON.stringify({
        message: 'folder updated!',
        folder,
      }),
    )

    expect(fetchMock.mock.calls.length).toEqual(1)

    expect(fetchMock.mock.calls[0][0]).toEqual(
      '/api/folders/clonucbtt0008fodshvfo6mcg',
    )
    expect(fetchMock.mock.calls[0][1]).toEqual({
      method: 'PUT',
      body: JSON.stringify(folder),
      headers: {'Content-Type': 'application/json'},
    })

    await waitFor(() => expect(mockOnClose).toHaveBeenCalledTimes(1))

    // expect(mockOnClose).toHaveBeenCalled()
    expect(useRouter().refresh).toHaveBeenCalled()
  })
})

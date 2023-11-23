import React from 'react'
import {render, fireEvent, waitFor} from '@testing-library/react'
import NewFolder from '../src/components/folders/new'
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

describe('NewFolder component', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('renders new folder modal and create a new folder', async () => {
    const mockOnClose = jest.fn()
    const mockFolder = {id: 'clonucbtt0008fodshvfo6mcg', name: 'Case'}
    const props: UseDisclosureProps & {folder: any | null} = {
      isOpen: true,
      onClose: mockOnClose,
      folder: mockFolder,
    }

    const {getByLabelText, getByText} = render(
      <NewFolder {...props} parentId={null} />,
    )

    expect(getByText('Create a folder')).toBeInTheDocument()
    expect(getByLabelText('Name')).toBeInTheDocument()

    const nameInput = getByLabelText('Name')
    fireEvent.change(nameInput, {target: {value: 'Case'}})

    const submitButton = getByText('Create')
    fireEvent.click(submitButton)

    const folder = {
      name: 'Case',
    }

    fetchMock.mockResponseOnce(
      JSON.stringify({
        message: 'folder created!',
        folder,
      }),
    )

    expect(fetchMock.mock.calls.length).toEqual(1)

    expect(fetchMock.mock.calls[0][0]).toEqual('/api/folders/')
    expect(fetchMock.mock.calls[0][1]).toEqual({
      method: 'POST',
      body: JSON.stringify(folder),
      headers: {'Content-Type': 'application/json'},
    })

    await waitFor(() => expect(mockOnClose).toHaveBeenCalledTimes(1))

    // expect(mockOnClose).toHaveBeenCalled()
    expect(useRouter().refresh).toHaveBeenCalled()
  })
})

import React from 'react'
import {render, fireEvent, waitFor} from '@testing-library/react'
import DeleteFolder from '../src/components/folders/delete'
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

describe('Delete component', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('renders delete folder modal and delete the folder', async () => {
    const mockOnClose = jest.fn()
    const mockFolder = {id: 'clonucbtt0008fodshvfo6mcg', name: 'Case'}
    const props: UseDisclosureProps & {folder: any | null} = {
      isOpen: true,
      onClose: mockOnClose,
      folder: mockFolder,
    }

    const {getByText} = render(<DeleteFolder {...props} />)

    expect(getByText('Delete folder')).toBeInTheDocument()
    expect(
      getByText('Do you really want to delete this folder?'),
    ).toBeInTheDocument()

    const deleteButton = getByText('Delete')
    fireEvent.click(deleteButton)

    fetchMock.mockResponseOnce(
      JSON.stringify({
        message: 'folder deleted!',
      }),
    )

    expect(fetchMock.mock.calls.length).toEqual(1)

    expect(fetchMock.mock.calls[0][0]).toEqual(
      '/api/folders/clonucbtt0008fodshvfo6mcg',
    )
    // console.log(await fetchMock.mock.results[0].value())
    expect(fetchMock.mock.calls[0][1]).toEqual({
      method: 'DELETE',
    })

    await waitFor(() => expect(mockOnClose).toHaveBeenCalledTimes(1))

    // expect(mockOnClose).toHaveBeenCalled()
    expect(useRouter().refresh).toHaveBeenCalled()
  })
})

import { render, screen, act, fireEvent } from "@testing-library/react"
import App from "./App"
import { afterEach, beforeEach, describe, expect, test } from 'vitest'


describe('Adding items to Todo List', () => {

    beforeEach(() => {
        // arrange
        render(<App />)
    })

    afterEach(() => {
        window.localStorage.clear()
    })

    test('Add item to Todo List', () => {
        const newItemInput = screen.getByLabelText('New Item')
        expect(newItemInput).toHaveValue("")
        addTodoItems("item 1")

        assertTodoItemsAppearInTodoList("item 1")
    })

    test('Clicking Add button does not add blank item to Todo List', () => {
        const todoList = screen.getByRole('list')
        expect(todoList).toHaveTextContent('No Todos')

        const addbutton = screen.getByText('Add')
        act(() => {
            addbutton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
        });

        // Assert item appears in list
        expect(todoList.children).toHaveLength(0)
        expect(todoList).toHaveTextContent('No Todos')
    })

    test('Add more than 1 item to Todo List', () => {
        const newItemInput = screen.getByLabelText('New Item')
        expect(newItemInput).toHaveValue("")
        addTodoItems("item 1", "item 2", "item 3")

        assertTodoItemsAppearInTodoList("item 1", "item 2", "item 3")
    })

})

// describe('Todo List item interaction', () => {
// })

function addTodoItems(...todoItems) {
    const newItemInput = screen.getByLabelText('New Item')
    for (const item of todoItems) {
        fireEvent.change(newItemInput, { target: { value: item } })
        expect(newItemInput).toHaveValue(item)

        const addbutton = screen.getByText('Add')
        act(() => {
            addbutton.dispatchEvent(new MouseEvent("click", { bubbles: true }))
        });
    }
}

function assertTodoItemsAppearInTodoList(...todoItems) {
    const todoList = screen.getByRole('list')
    expect(todoList.children).toHaveLength(todoItems.length)

    for (let i = 0; i < todoItems.length; i++) {
        const todoListItem1 = todoList.children[i]
        const todoListItem1Input = todoList.children[i].children[0]
        const todoListItem1Delete = todoList.children[i]
        expect(todoListItem1.children[0]).toHaveTextContent(todoItems[i])
        expect(todoListItem1Input).not.toBeChecked()
        expect(todoListItem1Delete).toHaveTextContent('Delete')
    }
}
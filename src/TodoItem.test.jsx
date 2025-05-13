import { render, screen } from "@testing-library/react"
import { TodoItem } from "./TodoItem"
import { expect, test } from 'vitest'

test.skip('Render Todo item', ()=>{
    render(<TodoItem />)

    screen.debug();

    expect()
})
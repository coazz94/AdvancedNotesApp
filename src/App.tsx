import "bootstrap/dist/css/bootstrap.min.css"
import { Container } from "react-bootstrap"
import { Routes, Route, Navigate } from "react-router-dom"
import { NewNote } from "./NewNote"

export type Note = {
    id: string
} & NoteData

export type NoteData = {
    title: string
    markdown: string
    tags: Tag[]
}

export type Tag = {
    id: string
    label: string
}

export function App() {
    return (
        <Container className="my-4">
            <Routes>
                // Home Route
                <Route path="/" element={<h1>Home</h1>} />
                // make a new Note
                <Route path="/new" element={<NewNote />} />
                // Id of the note
                <Route path="/:id">
                    // show this always at first
                    <Route index element={<h1>Show</h1>} />
                    // Access the edit page through the Notes id page
                    <Route path="edit" element={<h1>Edit</h1>} />
                </Route>
                // all other pages will be redirected to the Home Scree again
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Container>
    )
}

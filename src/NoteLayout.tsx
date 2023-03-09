import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import { Note } from "./App"

type NotesLayoutProps = {
    notes: Note[]
}

export function NoteLayout({ notes }: NotesLayoutProps) {
    // Get the id from the url
    const { id } = useParams()

    const note = notes.find((n) => n.id === id)

    // if not found navigate back to the Homepage and replace means to delete the URL
    if (note == null) return <Navigate to="/" replace />

    return <Outlet context={note} />
}

export function useNote() {
    return useOutletContext<Note>()
}

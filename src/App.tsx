import "bootstrap/dist/css/bootstrap.min.css"
import { useMemo } from "react"
import { Container } from "react-bootstrap"
import { Routes, Route, Navigate } from "react-router-dom"
import { NewNote } from "./NewNote"
import { useLocalStorage } from "./useLocalStorage"
import { v4 as uuidV4 } from "uuid"
import { Notelist } from "./Notelist"
import { NoteLayout } from "./NoteLayout"
import { Note } from "./Note"
import { EditNote } from "./EditNote"

// Here we need the id, but we add also the Note-Data type
export type Note = {
    id: string
} & NoteData

// NoteData should not have a id, because its not directly linked to the note
export type NoteData = {
    title: string
    markdown: string
    tags: Tag[]
}

// Tag Type defined
export type Tag = {
    id: string
    label: string
}

// we store just the id for the Tag (because of renaming)
export type RawNote = {
    id: string
} & RawNoteData

export type RawNoteData = {
    title: string
    markdown: string
    tagIds: string[]
}

export function App() {
    const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
    const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

    const notesWithTags = useMemo(() => {
        // loop over all my notes
        return notes.map((note) => {
            return {
                // keep the information from the note
                ...note,
                // tags, have the id stored in the note
                tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
            }
        })
    }, [notes, tags])

    // function that takes in tags, and NoteData
    function onCreateNote({ tags, ...data }: NoteData) {
        // update the current stored notes to the new note
        setNotes((prevNotes) => {
            return [
                // take the previous notes
                ...prevNotes,
                // add a new note, with data(title, markdown), add a random id, add all the ids from the tags that where added to TagIDS
                { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
            ]
        })
    }

    function addTag(tag: Tag) {
        setTags((prev) => [...prev, tag])
    }

    function onUpdateNote(id: string, { tags, ...data }: NoteData) {
        setNotes((prevNotes) => {
            return prevNotes.map((note) => {
                if (note.id === id) {
                    return {
                        ...note,
                        ...data,
                        tagIds: tags.map((tag) => tag.id),
                    }
                } else {
                    return note
                }
            })
        })
    }

    function onDeleteNote(id: string) {
        setNotes((prevNotes) => {
            return prevNotes.filter((note) => note.id !== id)
        })
    }

    return (
        <Container className="my-4">
            <Routes>
                // Home Route
                <Route
                    path="/"
                    element={
                        <Notelist availableTags={tags} notes={notesWithTags} />
                    }
                />
                // make a new Note
                <Route
                    path="/new"
                    element={
                        <NewNote
                            onSubmit={onCreateNote}
                            onAddTag={addTag}
                            availableTags={tags}
                        />
                    }
                />
                // Id of the note
                <Route
                    path="/:id"
                    element={<NoteLayout notes={notesWithTags} />}
                >
                    // show this always at first
                    <Route index element={<Note onDelete={onDeleteNote} />} />
                    // Access the edit page through the Notes id page
                    <Route
                        path="edit"
                        element={
                            <EditNote
                                onSubmit={onUpdateNote}
                                onAddTag={addTag}
                                availableTags={tags}
                            />
                        }
                    />
                </Route>
                // all other pages will be redirected to the Home Scree again
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Container>
    )
}

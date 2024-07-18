sequenceDiagram
    participant browser
    participant server
    
    Note right of browser: User types a new note and submits the form
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: 201 Created
    deactivate server
    
    Note right of browser: The browser updates the notes list without reloading the page
    Note right of browser: The new note appears on the list immediately

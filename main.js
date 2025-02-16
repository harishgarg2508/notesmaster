class NotesApp {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || [];
        this.history = JSON.parse(localStorage.getItem('notesHistory')) || [];
        this.currentNote = null;
        this.categories = new Set(['work', 'personal', 'ideas']);
        this.initializeElements();
        this.attachEventListeners();
        this.loadNotes();
        this.loadHistory();
        this.initializeEditor();
    }

    initializeElements() {
        // Buttons
        this.newNoteBtn = document.getElementById('newNoteBtn');
        this.deleteNoteBtn = document.getElementById('deleteNoteBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.addCategoryBtn = document.getElementById('addCategoryBtn');
        this.saveNoteBtn = document.getElementById('saveNoteBtn');
        
        // Input elements
        this.searchInput = document.getElementById('searchInput');
        this.titleInput = document.getElementById('noteTitle');
        this.categorySelect = document.getElementById('categorySelect');
        this.colorPicker = document.getElementById('colorPicker');
        this.bgColorPicker = document.getElementById('bgColorPicker');
        
        // Containers
        this.notesList = document.getElementById('notesList');
        this.noteContent = document.getElementById('noteContent');
        this.categoryList = document.getElementById('categoryList');
        this.historyList = document.getElementById('historyList');
        
        // Other elements
        this.lastSaved = document.getElementById('lastSaved');
        this.toolbar = document.querySelector('.toolbar');
    }

    attachEventListeners() {
        // Main functionality
        this.newNoteBtn.addEventListener('click', () => this.createNewNote());
        this.deleteNoteBtn.addEventListener('click', () => this.deleteCurrentNote());
        this.exportBtn.addEventListener('click', () => this.exportNote());
        this.addCategoryBtn.addEventListener('click', () => this.addNewCategory());
        this.saveNoteBtn.addEventListener('click', () => this.saveNote());
        
        // Input handlers
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.titleInput.addEventListener('input', (e) => this.handleTitleChange(e.target.value));
        this.categorySelect.addEventListener('change', (e) => this.handleCategoryChange(e.target.value));
        this.noteContent.addEventListener('input', () => this.handleContentChange());
        
        // Color controls
        this.colorPicker.addEventListener('change', (e) => {
            this.executeCommand('foreColor', e.target.value);
        });

        this.bgColorPicker.addEventListener('change', (e) => {
            this.noteContent.style.backgroundColor = e.target.value;
            if (this.currentNote) {
                this.currentNote.backgroundColor = e.target.value;
            }
        });
        
        // Toolbar actions
        this.toolbar.querySelectorAll('button[data-command]').forEach(button => {
            button.addEventListener('click', () => this.executeCommand(button.dataset.command));
        });
    }

    createNewNote() {
        const note = {
            id: Date.now(),
            title: 'Untitled Note',
            content: '',
            category: 'personal',
            backgroundColor: '#ffffff',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            saved: false
        };

        this.notes.unshift(note);
        this.currentNote = note;
        this.loadNotes();
        this.displayNote(note);
    }

    saveNote() {
        if (!this.currentNote) return;

        this.currentNote.saved = true;
        this.currentNote.updatedAt = new Date().toISOString();
        
        // Create history entry
        const historyEntry = {
            id: Date.now(),
            noteId: this.currentNote.id,
            title: this.currentNote.title,
            content: this.currentNote.content,
            category: this.currentNote.category,
            backgroundColor: this.currentNote.backgroundColor,
            savedAt: new Date().toISOString()
        };

        this.history.unshift(historyEntry);
        if (this.history.length > 50) { // Keep only last 50 history entries
            this.history.pop();
        }

        this.saveToLocalStorage();
        this.loadHistory();
        this.loadNotes();
        this.updateLastSaved(this.currentNote.updatedAt);

        // Show save animation
        this.saveNoteBtn.classList.add('saved');
        setTimeout(() => this.saveNoteBtn.classList.remove('saved'), 1000);
    }

    loadNotes() {
        this.notesList.innerHTML = '';
        this.notes.forEach(note => {
            const noteCard = this.createNoteCard(note);
            this.notesList.appendChild(noteCard);
        });

        if (this.currentNote) {
            const currentCard = this.notesList.querySelector(`[data-id="${this.currentNote.id}"]`);
            if (currentCard) currentCard.classList.add('active');
        }
    }

    loadHistory() {
        this.historyList.innerHTML = '';
        this.history.forEach(entry => {
            const historyItem = this.createHistoryItem(entry);
            this.historyList.appendChild(historyItem);
        });
    }

    createHistoryItem(entry) {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <h3>${entry.title}</h3>
            <p>${entry.category} • ${this.formatDate(entry.savedAt)}</p>
        `;
        div.addEventListener('click', () => this.restoreFromHistory(entry));
        return div;
    }

    restoreFromHistory(historyEntry) {
        const note = this.notes.find(n => n.id === historyEntry.noteId);
        if (note) {
            note.content = historyEntry.content;
            note.title = historyEntry.title;
            note.category = historyEntry.category;
            note.backgroundColor = historyEntry.backgroundColor;
            note.updatedAt = new Date().toISOString();
            
            this.displayNote(note);
            this.saveToLocalStorage();
            this.loadNotes();
        }
    }

    createNoteCard(note) {
        const div = document.createElement('div');
        div.className = 'note-card';
        div.dataset.id = note.id;
        div.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.category} • ${this.formatDate(note.updatedAt)}</p>
        `;
        div.addEventListener('click', () => this.displayNote(note));
        return div;
    }

    displayNote(note) {
        this.currentNote = note;
        this.titleInput.value = note.title;
        this.noteContent.innerHTML = note.content;
        this.categorySelect.value = note.category;
        this.noteContent.style.backgroundColor = note.backgroundColor || '#ffffff';
        this.bgColorPicker.value = note.backgroundColor || '#ffffff';
        this.updateLastSaved(note.updatedAt);
        
        document.querySelectorAll('.note-card').forEach(card => {
            card.classList.toggle('active', card.dataset.id === String(note.id));
        });
    }

    handleTitleChange(value) {
        if (!this.currentNote) return;
        this.currentNote.title = value;
        this.currentNote.saved = false;
    }

    handleCategoryChange(value) {
        if (!this.currentNote) return;
        this.currentNote.category = value;
        this.currentNote.saved = false;
    }

    handleContentChange() {
        if (!this.currentNote) return;
        this.currentNote.content = this.noteContent.innerHTML;
        this.currentNote.saved = false;
    }

    deleteCurrentNote() {
        if (!this.currentNote) return;
        
        if (confirm('Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(note => note.id !== this.currentNote.id);
            this.saveToLocalStorage();
            this.currentNote = this.notes[0] || null;
            this.loadNotes();
            if (this.currentNote) {
                this.displayNote(this.currentNote);
            } else {
                this.clearEditor();
            }
        }
    }

    clearEditor() {
        this.titleInput.value = '';
        this.noteContent.innerHTML = '';
        this.noteContent.style.backgroundColor = '#ffffff';
        this.bgColorPicker.value = '#ffffff';
        this.updateLastSaved('Never');
    }

    handleSearch(query) {
        const filteredNotes = this.notes.filter(note => 
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.content.toLowerCase().includes(query.toLowerCase())
        );
        
        this.notesList.innerHTML = '';
        filteredNotes.forEach(note => {
            const noteCard = this.createNoteCard(note);
            this.notesList.appendChild(noteCard);
        });
    }

    executeCommand(command, value = null) {
        document.execCommand(command, false, value);
        this.noteContent.focus();
        this.handleContentChange();
    }

    addNewCategory() {
        const category = prompt('Enter new category name:');
        if (category && !this.categories.has(category)) {
            this.categories.add(category);
            this.updateCategoryUI(category);
        }
    }

    updateCategoryUI(newCategory) {
        // Update category list in sidebar
        const button = document.createElement('button');
        button.className = 'category';
        button.dataset.category = newCategory;
        button.textContent = newCategory;
        this.categoryList.appendChild(button);

        // Update category select in editor
        const option = document.createElement('option');
        option.value = newCategory;
        option.textContent = newCategory;
        this.categorySelect.appendChild(option);
    }

    exportNote() {
        if (!this.currentNote) return;
        
        const content = `
            <html>
                <head>
                    <title>${this.currentNote.title}</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            max-width: 800px; 
                            margin: 40px auto; 
                            padding: 20px;
                            background-color: ${this.currentNote.backgroundColor};
                        }
                        h1 { color: #2563eb; }
                    </style>
                </head>
                <body>
                    <h1>${this.currentNote.title}</h1>
                    <p><strong>Category:</strong> ${this.currentNote.category}</p>
                    <p><strong>Last Updated:</strong> ${this.formatDate(this.currentNote.updatedAt)}</p>
                    <hr>
                    ${this.currentNote.content}
                </body>
            </html>
        `;
        
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentNote.title}.html`;
        a.click();
        URL.revokeObjectURL(url);
    }

    saveToLocalStorage() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
        localStorage.setItem('notesHistory', JSON.stringify(this.history));
    }

    updateLastSaved(date) {
        this.lastSaved.textContent = `Last saved: ${this.formatDate(date)}`;
    }

    formatDate(dateString) {
        if (dateString === 'Never') return dateString;
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    initializeEditor() {
        if (this.notes.length > 0) {
            this.displayNote(this.notes[0]);
        }
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.notesApp = new NotesApp();
});


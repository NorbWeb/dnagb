# collection `pages`

- title (String)
- slug (String, unique)
- parent (Many-to-one auf pages selbst – für die Hierarchie)
- sort (Integer – für die Menüreihenfolge)
- status (Published/Draft)
- content (JSON-Feld für deine WYSIWYG-Bausteine)

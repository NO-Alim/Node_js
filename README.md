- **✅ Day 19: Advanced Querying (Filtering, Sorting, Pagination)**
    
    ### 🎯 Objective:
    
    Make your API more powerful and flexible with query options.
    
    ### 📚 Topics:
    
    - Filter with query params (`GET /tasks?completed=true`)
        
        **Concept:** Clients send query parameters in the URL (e.g., `?fieldName=value`). Your API extracts these parameters and uses them to build a `find()` query in Mongoose.
        
        - **Exact Matching:** Simple `key=value` pairs directly map to Mongoose queries (e.g., `?completed=true` becomes `{ completed: true }`).
        - **Advanced Operators:** For more complex filtering (e.g., greater than, less than), you'll often see patterns like `?price[gte]=100`. We need to convert `[gte]` to Mongoose's `$gte` operator.
    - Sort by fields (`?sort=dueDate`)
        
        **Concept:** Clients specify a field (or multiple fields) to sort the results.
        
        - **Ascending Order:** `?sort=fieldName` (e.g., `?sort=dueDate`)
        - **Descending Order:** `?sort=-fieldName` (e.g., `?sort=-dueDate`). The hyphen () indicates descending.
        - **Multiple Fields:** `?sort=field1,-field2` for sorting by `field1` ascending, then `field2` descending. Mongoose `sort()` method accepts a space-separated string (e.g., `'field1 -field2'`).
    - Pagination (`?page=2&limit=10`)
        
        **Concept:** Instead of returning all records at once, pagination divides the results into smaller, manageable chunks (pages).
        
        - **`page`**: The requested page number (e.g., `?page=2`).
        - **`limit`**: The number of records per page (e.g., `?limit=10`).
        - **`skip` (offset)**: Calculated as `(page - 1) * limit`. This tells Mongoose how many documents to skip before starting the results for the current page.
        - **Mongoose Methods**: `skip()` and `limit()` are used on the query object.
        - **Response**: It's good practice to return metadata like `total` records, `page`, and `limit` so the client can build proper pagination controls.
    - Search with `title[regex]`
        
        **Concept:** Allow clients to search for partial matches within string fields using regular expressions.
        
        - **Pattern**: Often, you'll see `fieldName[regex]=search_term` (e.g., `?title[regex]=work`).
        - **Mongoose `$regex`**: This operator is used for pattern matching.
        - **`$options: 'i'`**: This option makes the search case-insensitive.
    
    ### 💻 Task:

This project's task management features have been enhanced by incorporating advanced querying capabilities, following the implementation patterns demonstrated in the [task-manager-api](https://github.com/NO-Alim/task-manager-api/tree/feature/advanced-querying) repository. Key functionalities now include:

1.  **Filtering**:
    *   Tasks can be filtered by their `completed` status (e.g., `GET /tasks?completed=true`).
    *   Advanced operators (`gte`, `gt`, `lte`, `lt`) are supported for numerical and date fields like `createdAt`, transforming query parameters (e.g., `createdAt[gte]=2023-01-01`) into Mongoose-compatible `$operator` syntax.

2.  **Sorting**:
    *   Results can be sorted by fields such as `dueDate` or `createdAt`.
    *   Both ascending (`?sort=fieldName`) and descending (`?sort=-fieldName`) orders are supported, along with multi-field sorting (e.g., `?sort=field1,-field2`).

3.  **Pagination**:
    *   Task retrieval now includes pagination, allowing clients to specify `page` and `limit` parameters (e.g., `GET /tasks?page=2&limit=10`).
    *   The API calculates `skip` values to efficiently return paginated results and includes `total` records, `page`, and `limit` in the response metadata.

4.  **Search**:
    *   A case-insensitive search functionality is implemented for the `title` field using regular expressions (e.g., `GET /tasks?title[regex]=work`), leveraging Mongoose's `$regex` operator with `$options: 'i'`.

These features were integrated using a reusable query handler to manage the complexity of filtering, sorting, pagination, and searching, ensuring a robust and flexible API.
    
    ### 🔁 Assignment:
    
    - Build a reusable query handler (bonus: use a class or utility function)
    [task-manager-api](https://github.com/NO-Alim/task-manager-api/tree/feature/advanced-querying-improvements) repository. Key functionalities now include:
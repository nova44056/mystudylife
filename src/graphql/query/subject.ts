const getSubjectsQuery = `
    query{
        getSubjects{
            id
            name
            academicYear{
                id
                startDate
                endDate
            }
        }
    }
`;

export { getSubjectsQuery };

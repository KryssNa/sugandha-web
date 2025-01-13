
const getZodValidationErrors = (error): Record<string, string> => {
    return error.errors.reduce((acc, { path, message }) => {
        return {
            ...acc,
            [path.join('.')]: message,
        };
    }, {});
}

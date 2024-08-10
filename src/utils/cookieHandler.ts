export function getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    console.log('cookie value in frontend:', value);

    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts[1].split(';')[0];
        console.log('cookie value extracted:', cookieValue);
        return cookieValue;
    }

    console.log(`Cookie with name "${name}" not found`);
    return undefined;
}

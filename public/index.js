kbs.serverSideData = { foo: 'bar' };
kbs.callback = (response) => {
    console.log('callback', response);
}
console.log('serverSideData', kbs.serverSideData);

document.addEventListener('DOMContentLoaded', () => {
    const buttonEl = document.getElementById('programmaticallyCall');
    buttonEl.addEventListener('click', async () => {
        const { kbs } = window;

        const data = {
            foo: 'bar'
        };
        const response = await kbs.trackEvent('custom', data);
        console.log('Programmatically Call', response);
    });
});
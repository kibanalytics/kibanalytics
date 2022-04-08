kbs.serverSideData = { foo: 'bar' };
console.log('serverSideData', kbs.serverSideData);

kbs.callback = (response) => {
    console.log('callback', response);
}

document.addEventListener('DOMContentLoaded', () => {
    const buttonEl01 = document.getElementById('button01');
    buttonEl01.addEventListener('click', () => console.log('Click Event'));

    const buttonEl02 = document.getElementById('button02');
    buttonEl02.addEventListener('click', () => console.log('Click Event (Custom Data)'));

    const buttonEl03 = document.getElementById('button03');
    buttonEl03.addEventListener('click', async () => {
        const { kbs } = window;

        const data = {
            foo: 'bar'
        };
        const response = await kbs.trackEvent('custom', data);
        console.log('Programmatically Call', response);
    });
});
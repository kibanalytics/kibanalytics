kbs.serverUrl = '/collect';

kbs.eventClassPrefix = 'kbs';

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
        const response = await kbs.track('custom', data);
        console.log('Programmatically Call', response);
    });

    const eventList = [{
        selector: '#button04',
        type: 'click',
        data: {
            id: 'button04',
            name: 'Selector List Btn 1',
            foo: 'bar'
        }
    }, {
        selector: '#button05',
        type: 'click',
        data: {
            id: 'button05',
            name: 'Selector List Btn 2',
            foo: 'bar'
        }
    }, {
        selector: '#button06',
        type: 'click',
        label: 'button06Click',
        data: {
            id: 'button06',
            name: 'Selector List Btn 3',
            foo: 'bar'
        }
    }];

    kbs.trackEventList(eventList);
    console.log('trackEventList loaded.');

    const eventListUrl = '/event-list.json';
    kbs.trackEventListUrl(eventListUrl).then(() => console.log('trackEventListUrl loaded.'));
});
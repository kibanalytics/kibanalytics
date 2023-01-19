/*
	Example how to add custom and class events
 */
document.addEventListener('DOMContentLoaded', () => {
	const { kbs } = window;

	const customEventBtn = document.getElementById('customEventBtn');
	customEventBtn.addEventListener('click', async () => {
		const data = {
			id: 'button01',
			name: 'Custom event'
		};
		const response = await kbs.track('customEvent', data);
		console.log('Programmatically triggered customEvent', response);
	});

	const eventList = [{
		selector: '.class-event-btn',
		type: 'click',
		data: {
			id: 'button02',
			name: 'Class click event.'
		}
	}];

	kbs.trackEventList(eventList);
});
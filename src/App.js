const remote = window.require('@electron/remote');
import Download from './components/Download';
import { useState, useEffect } from 'react';
import { Menu } from 'semantic-ui-react';


function App() {
	const [active, setActive] = useState('download');

	return (
		<div className='pb-5'>
			<Menu className='rounded-none'>
				<Menu.Item
					name='download'
					active={active === 'download'}
					onClick={() => setActive('download')}
				>Download Torrents</Menu.Item>
				<Menu.Item
					name='seed'
					active={active === 'seed'}
					onClick={() => setActive('seed')}
				>Seed Files</Menu.Item>
			</Menu>
			{active === 'download' && <Download />}
		</div>
	);
}

export default App;

import Download from './components/Download';
import { useState, useEffect } from 'react';
import { Menu } from 'semantic-ui-react';
import Seed from './components/Seed';


function App() {
	const [active, setActive] = useState('download');

	return (
		<div className='pb-5'>
			<Menu className='rounded-none z-50 sticky top-0'>
				<Menu.Item
					name='download'
					active={active === 'download'}
					onClick={() => setActive('download')}
				>Download Torrents &nbsp;<i className='fa-solid fa-download'></i></Menu.Item>
				<Menu.Item
					name='seed'
					active={active === 'seed'}
					onClick={() => setActive('seed')}
				>Seed Files</Menu.Item>
			</Menu>
			{active === 'download' && <Download />}
			{active === 'seed' && <Seed />}
		</div>
	);
}

export default App;

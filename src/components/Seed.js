import downloadsFolder from 'downloads-folder';
import moment from 'moment';
import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import prettyBytes from '../prettyBytes';
import { Input, Button, Table } from 'semantic-ui-react';
import loadingData from '../misc/loading.json';
import webtorrent from 'webtorrent';
import dragDrop from 'drag-drop';

export default function Seed() {
	const [loading, setLoading] = useState(false);
	const [torrent, setTorrent] = useState(null);
	const client = new webtorrent();

	useEffect(() => {
		dragDrop('#upload', (files) => {
			client.seed(files, (res) => {
				setTorrent(res);
			});
		});
	}, []);

	return (
		<div className='pt-8 px-40'>
			<h1 className='text-center text-3xl'>Seed files</h1>
			<div id='upload' className='my-8 h-48 w-full bg-zinc-500 rounded-3xl border-dashed border-4'>
				<div className='flex justify-center items-center h-full'>
					<div className='flex flex-col items-center'>
						<i className='fa-solid fa-cloud-upload text-5xl text-zinc-300'></i>
						<p className='text-zinc-300 text-center'>Drag and drop files here to seed them.</p>
					</div>
				</div>
				{torrent && (
					<div className='grid grid-cols-3 text-center text-zinc-600 my-10'>
						<div>
							<h2 className='text-2xl'>Hash</h2>
							<p>{torrent.infoHash}</p>
						</div>
						<div>
							<h2 className='text-2xl'>Magnet</h2>
							<a href={torrent.magnetURI}>Magnet URI</a>
						</div>
						<div>
							<h2 className='text-2xl'>Torrent file</h2>
							<a href={torrent.torrentFileBlobURL} download={`${torrent.name}.torrent`}>Download torrent file</a>
						</div>
					</div>
				)}
			</div>
			{loading && (
				<div className='flex justify-center items-center h-full'>
					<div className='flex flex-col items-center'>
						<Lottie animationData={loadingData} />
					</div>
				</div>
			)}
		</div>
	);
}
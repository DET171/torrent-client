import downloadsFolder from 'downloads-folder';
import moment from 'moment';
import { useState, useEffect } from 'react';
import prettyBytes from '../prettyBytes';
import { Input, Button, Table } from 'semantic-ui-react';
import webtorrent from 'webtorrent';

export default function Download() {
	const [torrent, setTorrent] = useState(null);
	const [remaining, setRemaining] = useState(0);
	const [folder, setFolder] = useState(downloadsFolder());
	const [data, setData] = useState(null);

	const client = new webtorrent();

	useEffect(() => {
		console.log(data);
	}, [data]);

	const download = () => {
		client.add(torrent, { path: folder }, (res) => {
			setInterval(() => {
				setData(res);
				// eslint-disable-next-line no-shadow
				let remaining;
				if (res.done) {
					remaining = 'Done.';
				}
				else {
					remaining = moment.duration(res.timeRemaining / 1000, 'seconds').humanize();
					remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.';
				}
				setRemaining(remaining);
			}, 500);

			res.on('done', () => {
				console.log('done');
			});
		});
	};

	return (
		<div className='pt-8 px-40'>
			<h1 className='text-center text-3xl'>Download torrent</h1>
			<div className='flex justify-center mt-5'>
				<label className=''>
				Choose torrent to download: &nbsp;&nbsp;
					<input type='file' className='text-sm text-grey-500
            file:mr-5 file:py-2 file:px-6
            file:rounded-full file:border-0
            file:text-sm file:font-medium
            file:bg-blue-50 file:text-blue-700
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700
          ' onChange={(e) => {
						const file = e.target.files[0];
						setTorrent(file.path);
					}} />
				</label>
			</div>
			<h2 className='text-center text-xl m-5'>OR</h2>
			<div className=''>
				<Input label='Enter magnet, hash or http(s) .torrent' type='text' fluid onChange={(e) => {
					setTorrent(e.target.value);
				}} />
			</div>
			<Input
				className='mt-5 w-full'
				label={
					<Button className='text-slate-800 bg-red-200 hover:bg-red-300 duration-300' onClick={() => download()}>Download Torrent</Button>
				}
				placeholder='Download folder'
				value={folder}
				onChange={(e) => {
					setFolder(e.target.value);
				}}
				labelPosition='right'
			/>


			<Table celled className='mt-5'>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>File</Table.HeaderCell>
						<Table.HeaderCell>Progress</Table.HeaderCell>
						<Table.HeaderCell>Downloaded</Table.HeaderCell>
						<Table.HeaderCell>Total Size</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{data && data.files.map((file) => (
						<Table.Row key={file.name}>
							<Table.Cell>{file.name}</Table.Cell>
							<Table.Cell>{Math.round(file.progress * 100 * 100) / 100}%</Table.Cell>
							<Table.Cell>{prettyBytes(file.downloaded)}</Table.Cell>
							<Table.Cell>{prettyBytes(file.length)}</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>
			{data && <ul className='text-center my-5'>
				<li>{data && (data.done
					? 'Downloaded'
					: `Downloaded ${prettyBytes(data.downloaded)} of ${prettyBytes(data.length)} (${Math.round(data.progress * 100 * 100) / 100}%), ${remaining}`)}
				</li>
				<li>{data && `Upload Speed: ${prettyBytes(data.uploadSpeed)}`}</li>
				<li>{data && `Download Speed: ${prettyBytes(data.downloadSpeed)}`}</li>
				<li>{data && `Peers: ${data.numPeers}`}</li>
				<li>{data && `Seed Ratio: ${data.ratio}`}</li>
			</ul>}
			{data && (<>
				<h2 className='text-center text-2xl'>Trackers</h2>
				<ul className='text-center'>
					{data && data.announce.map((tracker) => (
						<li key={tracker}>{tracker}</li>
					))}
				</ul>
			</>)}
		</div>
	);
}
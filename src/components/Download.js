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

			{data && (
				<div className='grid my-8 grid-cols-3 text-center text-xl'>
					<div><i className='fa-solid fa-arrow-down'></i>&nbsp;{prettyBytes(data.downloadSpeed)}/s</div>
					<div><i className='fa-solid fa-arrow-up'></i>&nbsp;{prettyBytes(data.uploadSpeed)}/s</div>
					<div><i className='fa-solid fa-person'></i>&nbsp;{data.numPeers} peers</div>
				</div>
			)}

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
			{data && <div className='my-8'>
				<div className='w-full h-6 bg-gray-500 rounded-full'>
					<p className='text-center h-6'>{prettyBytes(data.downloaded)}/{prettyBytes(data.length)} ({Math.round(data.progress * 100 * 100) / 100}%), {remaining}</p>
					<div className='h-6 -mt-6 bg-green-300 rounded-full duration-100' style={{
						width: `${data ? data.progress * 100 : 0}%`,
					}}></div>
				</div>
			</div>}
			<h2 className='text-center text-2xl'>Trackers</h2>
			<Table className='text-center'>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Address</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{data && data.announce.map((url) => (
						<Table.Row key={url}>
							<Table.Cell>{url}</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table>
		</div>
	);
}
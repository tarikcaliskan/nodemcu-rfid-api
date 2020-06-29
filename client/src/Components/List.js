import React, { Component } from 'react';
import axios from 'axios';
export default class List extends Component {
	state = {
		histories: [],
		users: [],
	};
	componentDidMount() {
		axios.get(`/history`).then((res) => {
			const histories = res.data;
			this.setState({ histories });
		});
		axios.get(`/register`).then((res) => {
			const users = res.data;
			this.setState({ users });
		});
	}
	render() {
		function exportHTML() {
			var header =
				"<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
				"xmlns:w='urn:schemas-microsoft-com:office:word' " +
				"xmlns='http://www.w3.org/TR/REC-html40'>" +
				"<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
			var footer = '</body></html>';
			var sourceHTML =
				header + document.getElementById('source-html').innerHTML + footer;

			var source =
				'data:application/vnd.ms-word;charset=utf-8,' +
				encodeURIComponent(sourceHTML);
			var fileDownload = document.createElement('a');
			document.body.appendChild(fileDownload);
			fileDownload.href = source;
			fileDownload.download = 'document.doc';
			fileDownload.click();
			document.body.removeChild(fileDownload);
		}
		return (
			<div>
				<div className="flex flex-col px-5 sm:w-3/4 mx-auto mt-12 mb-12">
					<button
						id="btn-export"
						className="my-4 p-4 rounded-md bg-red-600 text-white font-semibold"
						onClick={exportHTML}
					>
						Word'e çıkart
					</button>
					<div
						className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
						id="source-html"
					>
						<div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
							<table className="min-w-full">
								<thead className="bg-white">
									<tr>
										<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
											Kullanıcı
										</th>
										<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
											Durum
										</th>
										<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
											Giriş Zamanı
										</th>
										<th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
											Çıkış Zamanı
										</th>
									</tr>
								</thead>
								<tbody className="bg-white">
									{this.state.histories.map((history) => (
										<tr key={history._id}>
											<td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
												<div className="flex items-center">
													<div className="ml-1">
														<div className="text-sm leading-5 font-medium text-gray-900">
															{this.state.users.map((user) =>
																user._id === history.ownerId
																	? user.ownerName
																	: null
															)}
														</div>
														<div className="text-sm leading-5 text-gray-500">
															{history.cardId}
														</div>
													</div>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
												<span
													className={
														history.isLogged
															? 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'
															: 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'
													}
												>
													{history.isLogged ? 'İçeride' : 'Dışarıda'}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
												<div className="text-sm leading-5 text-gray-900">
													{history.loginDate}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-900">
												{history.logoutDate}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<ul></ul>
			</div>
		);
	}
}

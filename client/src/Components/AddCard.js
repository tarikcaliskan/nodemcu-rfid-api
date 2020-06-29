import React, { Component } from 'react';
import axios from 'axios';
export default class AddCard extends Component {
	state = {
		ownerName: '',
		cardId: '',
		alert: ''
	};

	clearAlert = () => {
		this.setState({ alert: null });
	};

	changeInput = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	handleSubmit = (event) => {
		event.preventDefault();

		const headers = {
			'Content-Type': 'application/json'
		};

		axios
			.post(
				`/register`,
				{ ownerName: this.state.ownerName, cardId: this.state.cardId },
				{
					headers: headers
				}
			)
			.then((res) => {
				this.setState({ alert: res.data });
			});
	};
	render() {
		return (
			<div>
				<div className="max-w-md rounded-md bg-white overflow-hidden shadow-lg mx-auto h-full mt-12 ">
					<div className="px-6 py-4">
						<div className="font-bold text-xl text-gray-900 md:text-center mb-5">
							Kart kaydı ekle
						</div>
						{this.state.alert ? (
							<div className="text-center py-4 lg:px-4 mb-5">
								<div
									className="p-2 bg-blue-600 items-center text-blue-100 leading-none rounded-full flex lg:inline-flex"
									role="alert"
								>
									<span className="flex rounded-full bg-blue-400 uppercase px-2 py-1 text-xs font-bold mr-3">
										MESAJ
									</span>
									<span className="font-semibold mr-2 text-left flex-auto">
										{this.state.alert}
									</span>
									<svg
										onClick={this.clearAlert}
										className="fill-current opacity-75 h-4 w-4"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
									>
										<path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
									</svg>
								</div>
							</div>
						) : null}

						<form className="w-full max-w-sm" onSubmit={this.handleSubmit}>
							<div className="md:flex md:items-center mb-6">
								<div className="md:w-1/3">
									<label
										className="block text-gray-600 font-bold md:text-right mb-1 md:mb-0 pr-4"
										htmlFor="inline-full-name"
									>
										Ad Soyad
									</label>
								</div>
								<div className="md:w-2/3">
									<input
										className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-500"
										id="inline-full-name"
										name="ownerName"
										type="text"
										onChange={this.changeInput}
										placeholder="Ali Yılmaz"
										required
									/>
								</div>
							</div>
							<div className="md:flex md:items-center mb-6">
								<div className="md:w-1/3">
									<label
										className="block text-gray-600 font-bold md:text-right mb-1 md:mb-0 pr-4"
										htmlFor="card-id"
									>
										Kart ID
									</label>
								</div>
								<div className="md:w-2/3">
									<input
										className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-red-500"
										id="card-id"
										name="cardId"
										type="text"
										placeholder="Kart ID"
										required
										onChange={this.changeInput}
									/>
								</div>
							</div>

							<div className="md:flex md:items-center justify-end">
								<div className="md:w-2/3">
									<div className="md:w-1/3"></div>

									<button
										className="shadow bg-red-600 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-semibold py-2 px-4 rounded"
										type="submit"
									>
										Kaydet
									</button>
								</div>
							</div>
						</form>
					</div>
					<div className="px-6 py-4"></div>
				</div>
			</div>
		);
	}
}

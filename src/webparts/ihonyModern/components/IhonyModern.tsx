import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import styles from './IhonyModern.module.scss';

interface IProps {
  description: string;
  context: WebPartContext;
}

interface IState {
  title: string;
  name: string;
  category: string;
  company: string;
  country: string;
  description: string;
  inStock: string;
  goods: any[];
}

export default class IhonyModern extends React.Component<IProps, IState> {
  state={
    title: '',
    name: '',
    company: '',
    country: '',
    description: '',
    category: '',
    inStock: 'Yes',
    goods: null,
  }

  public async componentDidMount() {
    sp.setup({
      spfxContext: this.props.context
    })

    const goods: any[] = await sp.web.lists.getByTitle("Goods").items
      .select("Title", "description", "Id", "inStock", "category", "company/Title")
      .expand("company")
      .get();

    this.setState({goods})
  }

  public handleInputChange = (event: any) => {
    const value = event.target.value;
    const name = event.target.type === 'select-one'
      ? 'category'
      : event.target.name

    this.setState({[name]: value} as React.ComponentState);
  }

  public handleSubmit = (event: any) => {
    event.preventDefault();
  }

  public render(): React.ReactElement<IProps> {
    const {title, name, category, company, country, description, inStock, goods} = this.state;

    return (
      <div className="container">
        <h1>Goods List</h1>
        <ul>
          {goods && goods.map(({Title, category, company}) => (
            <li>
              <div>
                <b>title:</b> {Title}
              </div>
              <div>
                <b>category:</b> {category}
              </div>
              <div>
                <b>company:</b> {company.Title}
              </div>
            </li>
          ))}
        </ul>
        <form
          onChange={this.handleInputChange}
          onSubmit={this.handleSubmit} 
        >
          <div>
            <div>Title</div>
            <input
              type="text" 
              name="title"
              value={title}
            />
          </div>
          <div>
            <div>Name</div>
            <input
              type="text" 
              name="name"
              value={name}
            />
          </div>
          <div>
            <div>Company</div>
            <input
              type="text" 
              name="company"
              value={company}
            />
          </div>
          <div>
            <div>Country</div>
            <input
              type="text" 
              name="country"
              value={country}
            />
          </div>
          <div>
            <div>Category</div>
            <select
              value={category}
            >
              <option value="food">food</option>
              <option value="clothes">clothes</option>
              <option value="medicine">medicine</option>
            </select>
          </div>
          <div>
            <div>Description</div>
            <textarea
              name="description"
              value={description} 
              placeholder="Type description"
            />
          </div>
          <div>
            <div>In stock</div>
          <div>
            <label>
              <input
                type="radio" 
                value="Yes"
                name="inStock"
                checked={inStock === 'Yes'}
              />
              Yes
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio" 
                value="No"
                name="inStock"
                checked={inStock === 'No'}
              />
              No
            </label>
        </div>
          </div>
          <button>
            Add
          </button>
        </form>
      </div>
    );
  }
}

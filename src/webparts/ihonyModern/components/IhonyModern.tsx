import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import styles from './IhonyModern.module.scss';
import { IItemAddResult } from '@pnp/sp/items';

interface IProps {
  description: string;
  context: WebPartContext;
}

interface IState {
  Title: string;
  name: string;
  category: string;
  description: string;
  inStock: string;
  goods: any[];
}

export default class IhonyModern extends React.Component<IProps, IState> {
  state={
    Title: '',
    name: '',
    description: '',
    category: 'food',
    inStock: 'Yes',
    goods: null,
  }

  public async componentDidMount() {
    sp.setup({
      spfxContext: this.props.context
    })

    const goods: any[] = await sp.web.lists.getByTitle("Goods").items
      .select("Title", "description", "Id", "inStock", "category", "company/Title", "name")
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

  public handleSubmit = async (event: any) => {
    event.preventDefault();
    const {Title, name, category, description, inStock} = this.state;
    const newProduct = await sp.web.lists.getByTitle("Goods").items.add({
      name,
      Title, 
      category,
      description,
      inStock: inStock === 'Yes' ? true : false,
    })
    this.setState(({goods}) => {
      const {Title, name, category, description, inStock} = newProduct.data;

      return {
        Title: '',
        name: '',
        description: '',
        category: 'food',
        inStock: 'Yes',
        goods: [
          {Title, name, category, description, inStock},
          ...goods,
        ]
      }
    })

  }

  public render(): React.ReactElement<IProps> {
    const {Title, name, category, description, inStock, goods} = this.state;

    return (
      <div>
        <h1>Goods List</h1>
        <ul>
          {goods && goods.map(({Title, name, description, category, Id}) => (
            <li key={Id}>
              <div>
                <b>title:</b> {Title}
              </div>
              <div>
                <b>name:</b> {name}
              </div>
              <div>
                <b>description:</b> {description}
              </div>
              <div>
                <b>category:</b> {category}
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
              name="Title"
              value={Title}
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
                checked={inStock === "Yes"}
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
                checked={inStock === "No"}
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

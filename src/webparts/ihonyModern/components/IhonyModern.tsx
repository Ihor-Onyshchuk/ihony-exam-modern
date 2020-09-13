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
  goods: any[]
}

export default class IhonyModern extends React.Component<IProps, IState> {
  state={
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
    console.log(goods)
  }

  public render(): React.ReactElement<IProps> {
    const {goods} = this.state;

    return (
      <div>
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
      </div>
    );
  }
}

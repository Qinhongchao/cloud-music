import { isEmptyObject } from 'src/app/utils/tools';
import { SearchResult } from './data-types/common.types';
import { SearchService } from './services/search.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'cloud-music';
  menu=[
    {
      label:'发现',
      path:'/home'
    },
    {
      label:'歌单',
      path:'/sheet'
    }
  ]

  public searchResult:SearchResult;


  constructor(private searchServe:SearchService){

  }

  onSearch(keywords:string){
    if(keywords){
      this.searchServe.search(keywords).subscribe((res)=>{
        
        this.searchResult=this.highlightKeywords(keywords,res);
       
      })
    }else{
      this.searchResult={};
    }
  }
  highlightKeywords(keywords:string,result:SearchResult): SearchResult {
    if(!isEmptyObject(result)){
      const reg=new RegExp(keywords,'ig');
      ['artists','playlists','songs'].forEach(type=>{
        if(result[type]){
          result[type].forEach(item=>{
            item.name=item.name.replace(reg,'<span class="highlight">$&</span>');
          })
        }
      })
    }

    return result;
  }
}



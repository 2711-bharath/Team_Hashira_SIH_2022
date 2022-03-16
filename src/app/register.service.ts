import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private db:AngularFirestore) { };

  createProvider(provider:Object){
    const providerData=JSON.parse(JSON.stringify(provider));
    return this.db.collection('Provider').add(providerData);
  }

  getAllProviders():Observable<Object[]>{
    const Providers=this.db.collection<Object>('Provider').snapshotChanges().pipe(map(actions=>{
      return actions.map(c=>({
        providerId:c.payload.doc.id,
        ...c.payload.doc.data() as Object
      }));
    }));
    return Providers;
  }

  getProviderById(id:string):Observable<Object>{
    const Provider=this.db.doc<Object>('Provider/'+id).valueChanges();
    return Provider;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {}

  getData<T>(url: string, params: {} = null, adapter: any = null): Observable<T> {
    return this.http.get<T>(this.apiUrl + url, {params}).pipe(
      map((data: T) => {
        if (adapter) {
          return Array.isArray(data) ? data.map(item => adapter.adapt(item)) : adapter.adapt(data);
        }
        return data;
      })
    );
  }

  postData<T>(url: string, body: {} = null, adapter: any = null): Observable<T> {
    return this.http.post<T>(this.apiUrl + url, body).pipe(
      map((data: T) => {
        if (adapter) {
          return Array.isArray(data) ? data.map(item => adapter.adapt(item)) : adapter.adapt(data);
        }
        return data;
      })
    );
  }

  putData<T>(url: string, body: {} = null, adapter: any = null): Observable<T> {
    return this.http.put<T>(this.apiUrl + url, body).pipe(
      map((data: T) => {
        if (adapter) {
          return Array.isArray(data) ? data.map(item => adapter.adapt(item)) : adapter.adapt(data);
        }
        return data;
      })
    );
  }

  deleteData<T>(url: string, params: {} = null, adapter: any = null): Observable<T> {
    return this.http.delete<T>(this.apiUrl + url, {params}).pipe(
      map((data: T) => {
        if (adapter) {
          return Array.isArray(data) ? data.map(item => adapter.adapt(item)) : adapter.adapt(data);
        }
        return data;
      })
    );
  }
}

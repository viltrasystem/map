

ALTER2 procedure [dbo].[AssignMailToFilteredUsersInbox_SP]
@messageId int,
@gmt nvarchar(20),

@getAllLandOwners bit,
@getHeadLandOwners bit,--head of units
@getReportingLandOwners bit,--reporters
@getGeneralLandOwners bit,--not a reporter or either head of unit

@getAllHunters bit,
@getHeadHunters bit,--head of units
@getReportingHunters bit,--reporters
@getTeamLeaders bit,--team leaders
@getGeneralHunters bit,--not a reporter or a head of unit or a team leader
@getZeroReportingTeams bit,
@zeroRepType int,
@zeroRepGameId int,
@zeroRepAnimalId int,
@getTeamsWithMissingWeights bit,
@mwGameId int,
@mwAnimalId int,
@getTeamsInCommonQuota bit,
@quotaAnimalId int,
@quotaGameId int,
@huntingState int, --set to -1 when filter is not selected
@huntingStateGameId int,
@huntingStateAnimalId int,
@getTeamsWithInvalidReports bit,
@invalidReportsAnimalId int,
@invalidReportGameId int,
@getTeamsWithMultiObsReports bit,
@multiObsReportsAnimalId int,
@multiObsReportGameId int,

@getAllUpperUsers bit,--users other than teams
@getHeadUpperUsers bit,--head of units
@getReportingUpperUsers bit,--reporters
@getMunicipalityUpperUsers bit,--users with municipality role
@getExporterUpperUsers bit,--users with Exporter role
@getGuestUpperUsers bit,--users with guest role
@getGeneralUpperUsers bit,--users in upper units who has no any of the above roles

@unitListstr nvarchar(max),
@getAllChildren bit,
@exceptListStr nvarchar(max),
@doMail bit

as
begin
	
	SET NOCOUNT ON;
	
	create table #unit_tbl (unitId int,typeId int,unit nvarchar(50))
	
	declare @user_tbl table (uSysId int,uDnnId int,username nvarchar(100),email nvarchar(100),firstName nvarchar(100),lastName nvarchar(100),unitId int,unit nvarchar(50),msgId int)
	
	declare @condition nvarchar(max)
	declare @dynamic_sql nvarchar(Max)='select u.UnitID,u.TypeId,u.Unit
										from Units u 
										where u.UnitID in ('+@unitListstr+') 
											and u.IsActive=1
											and u.IsArchived=0'
									 
	insert into #unit_tbl EXEC sp_executesql @dynamic_sql
	
	if(@getAllChildren=1)
	begin
		
		;with Hierachy(UnitID, ParentUnitID, Level)
		as
		(
			select u.UnitID, u.ParentId, 1 as Level
			from Units u
			where u.UnitID in (select unitId from #unit_tbl) and u.IsActive=1
			union all
			select u.UnitID,u.ParentId,ch.Level + 1
			from Units u
			inner join Hierachy ch
			on u.ParentId = ch.UnitID and u.IsActive=1
		)
		insert into #unit_tbl
		select h.UnitID,u.TypeId,u.Unit
		from Hierachy h
		inner join Units u
		on u.UnitID=h.UnitID 
			and u.IsActive=1 
			and u.IsArchived=0-- get units that are not archived
			and h.Level > 1 --get only the child units since parent units are already inserted
					
		
	end
	
	--team related filters
	if(@getAllHunters=1 or @getHeadHunters=1 or @getReportingHunters =1 or @getGeneralHunters =1 or @getTeamLeaders=1)
	begin 
		
		--reset value
		set @dynamic_sql=''
		set @condition=''
		declare @singleUser_sql nvarchar(Max) =''
		
		declare @childFiltersExists bit = case when (@getZeroReportingTeams=0 and 
														@getTeamsWithMissingWeights=0 and 
														@getTeamsInCommonQuota=0 and 
														@huntingState=-1 and 
														@getTeamsWithInvalidReports=0 and 
														@getTeamsWithMultiObsReports=0) 
												then 0 else 1 end
		
		if(@getAllHunters=1)
		begin	
			
			if(@childFiltersExists=1)
			begin
				set @dynamic_sql+='select distinct v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,u.unitId,u.unit,-1/*msgId*/'
			end
			else
			begin
				set @dynamic_sql+='select distinct v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,-1/*unitId*/,''''/*unit*/,-1/*msgId*/'
			end
			
			set @dynamic_sql+=' from UnitHasUsers uu
								inner join #unit_tbl u
								on uu.UnitID=u.unitId and uu.IsActive=1 and u.typeId=6
								inner join ViltraUser v
								on v.UserID=uu.UserID and v.IsActive=1 and v.IsActiveUser=1'
			
			if(@exceptListStr<>'')
			begin 
				set @dynamic_sql+=' and v.UserID not in ('+@exceptListStr+')'			
			end
			
		end
		else if(@getHeadHunters=1 or @getReportingHunters =1 or @getGeneralHunters =1 or @getTeamLeaders=1)
		begin 
			
			--space infront is required inorder to keep the query without ovelapping with previously assigned strings
			if(@getHeadHunters=1)
			begin
				set @condition+=' uu.IsHead=1 or'
			end
			
			if(@getReportingHunters=1)
			begin
				set @condition+=' uu.IsReporter=1 or'
			end
			
			if(@getTeamLeaders=1)
			begin
				set @condition+=' uu.IsTeamLeader=1 or'
			end
			
			if(@getGeneralHunters=1)
			begin
				set @condition+=' (uu.IsReporter=0 and uu.IsHead=0 and uu.IsTeamLeader=0)'
			end
			--remove 'or' condition added at the end
			else if(@condition<>'')
			begin
				set @condition=	LEFT (@condition, LEN(@condition)-2)
			end
			
			if(@childFiltersExists=1)
			begin
				set @dynamic_sql+='select distinct v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,u.unitId,u.unit,-1/*msgId*/'
				if(@getTeamLeaders=1)
				begin
					set @singleUser_sql += ' union select distinct v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,u.unitId,u.unit,-1/*msgId*/'
				end
			end
			else
			begin
				set @dynamic_sql+='select distinct v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,-1/*unitId*/,''''/*unit*/,-1/*msgId*/'
				if(@getTeamLeaders=1)
				begin
					set @singleUser_sql += ' union select distinct v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,-1/*unitId*/,''''/*unit*/,-1/*msgId*/'
				end
			end
						
			if(@getTeamLeaders=1 and @singleUser_sql<>'')
				begin
					set @singleUser_sql += ' from UnitHasUsers uu
							inner join #unit_tbl u
							on uu.UnitID=u.unitId and uu.IsActive=1 and u.typeId=6
							inner join ViltraUser v
							on v.UserID=uu.UserID and v.IsActive=1 and v.IsActiveUser=1
							inner join 
							(select uhu.UnitID as UnitID, COUNT(vu.UserID) as userCount
							from UnitHasUsers uhu
							inner join #unit_tbl u
							on uhu.UnitID=u.unitId
							inner join ViltraUser vu
							on uhu.UserID=vu.UserID
								where uhu.IsActive=1  and vu.IsActive=1 and vu.IsActiveUser = 1
								group by uhu.unitid having COUNT(vu.UserID)=1) as userCountTbl
							on uu.UnitId= userCountTbl.unitid'
				end			
						
			if(@condition<>'')
			begin
				set @dynamic_sql+=' and ( '+@condition+' )'
			end
					
			set @dynamic_sql+=' inner join ViltraUser v
								on v.UserID=uu.UserID and v.IsActive=1 and v.IsActiveUser=1'
			
			if(@exceptListStr<>'')
			begin 
				set @dynamic_sql+=' and v.UserID not in ('+@exceptListStr+')'				
				if(@getTeamLeaders=1 and @singleUser_sql<>'')
				begin
					set @singleUser_sql+=' and v.UserID not in ('+@exceptListStr+')'
				end	
			end
			
		end
			
		declare @joined_sql nvarchar(max),@fullQuery nvarchar(max)
		--if any sub filters for team has not been selected
		if(@childFiltersExists=0)
		begin
			set @fullQuery=@dynamic_sql+@singleUser_sql
			insert into @user_tbl EXEC sp_executesql @fullQuery
		end
		--if there are sub filters selected for teams get users based on the selections
		else
		begin
			
			declare @now date=cast( getdate() as date)
			declare @temp_start date=cast(cast(year(@now) as varchar)+'-04-01' as date)
			declare @currentHuntingYear int=case when (@now<@temp_start) then (year(@now)-1) else year(@now) end
		
			--get teams that has not done any reporting for current season
			if(@getZeroReportingTeams=1)
			begin
				--reset value
				set @joined_sql=''
				set @fullQuery=''
				
				set @joined_sql+='	inner join UnitHasGame ug
									on ug.UnitID=u.unitId 
										and ug.GameID='+cast(@zeroRepGameId as varchar)+'
										and ug.IsActive=1
									left outer join AnimalAction a 
									on a.HuntingTeamID=u.unitId and a.IsActive=1
										and cast(a.ActionDate as date) >='''+cast(@currentHuntingYear as varchar)+'-04-01'' 
										and cast(a.ActionDate as date) <='''+cast((@currentHuntingYear+1) as varchar)+'-03-31''
										and a.AnimalTypeId='+cast(@zeroRepAnimalId as varchar)+'
										and a.GameID='+cast(@zeroRepGameId as varchar)+''
				
				--@zeroRepType -1 indicates that get both shot and observation
				if(@zeroRepType>-1)
				begin
					set @joined_sql+=' and a.IsShot='+cast(@zeroRepType as varchar)+''
				end
				
				set @joined_sql+='  group by v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,u.unitId,u.unit
									having COUNT(a.ActionId)=0'				
				
				if(@getTeamLeaders=1 and @singleUser_sql<>'')
				begin
					set @fullQuery=@dynamic_sql+@joined_sql+@singleUser_sql+@joined_sql
				end
				else
				begin
					set @fullQuery=@dynamic_sql+@joined_sql
				end
					insert into @user_tbl EXEC sp_executesql @fullQuery
			end
			
			if(@getTeamsWithMissingWeights=1)
			begin
				--reset value
				set @joined_sql='' 
				set @fullQuery=''
				
				set @joined_sql+='	inner join UnitHasGame ug
									on ug.UnitID=u.unitId 
										and ug.GameID='+cast(@mwGameId as varchar)+'
										and ug.IsActive=1
									left outer join AnimalAction a 
									on a.HuntingTeamID=u.unitId and a.IsActive=1 and a.IsShot=1
										and cast(a.ActionDate as date) >='''+cast(@currentHuntingYear as varchar)+'-04-01'' 
										and cast(a.ActionDate as date) <='''+cast((@currentHuntingYear+1) as varchar)+'-03-31''
										and a.AnimalTypeId='''+cast(@mwAnimalId as varchar)+'''
										and a.GameID='''+cast(@mwGameId as varchar)+'''
									left outer join AnimalActionAnimalDetails ad
									on a.ActionId=ad.ActionId
									group by v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,ad.AnimalWeight,a.ActionId,u.unitId,u.unit
									having ISNULL(ad.AnimalWeight,-1)<=0 and ISNULL(a.ActionId,-1)>0 -- check only if action exists'
				if(@getTeamLeaders=1 and @singleUser_sql<>'')
				begin
					set @fullQuery=@dynamic_sql+@joined_sql+@singleUser_sql+@joined_sql
				end
				else
				begin
					set @fullQuery=@dynamic_sql+@joined_sql
				end
				
				insert into @user_tbl EXEC sp_executesql @fullQuery
				
			end
			
			if(@getTeamsInCommonQuota=1)
			begin
				
				--reset value
				set @joined_sql='' 
				set @fullQuery=''
				
				set @joined_sql+=' left outer join CommonQuotaGroupHasUnit cqgu
									on cqgu.UnitId=u.unitId
									left outer join CommonQuotaGroup cqg
									on cqg.GroupId=cqgu.GroupId and cqg.IsActive =1
									and cqg.HuntingYear='''+cast(@currentHuntingYear as varchar)+'''
									and cqg.AnimalId='''+cast(@quotaAnimalId as varchar)+'''
									and cqg.GameId='''+cast(@quotaGameId as varchar)+'''
									group by v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,ISNULL(cqg.GroupId,-1),u.unitId,u.unit
									having ISNULL(cqg.GroupId,-1)>0'
				
				if(@getTeamLeaders=1 and @singleUser_sql<>'')
				begin
					set @fullQuery=@dynamic_sql+@joined_sql+@singleUser_sql+@joined_sql
				end
				else
				begin
					set @fullQuery=@dynamic_sql+@joined_sql
				end
				
				insert into @user_tbl EXEC sp_executesql @fullQuery												
				
			end
			
			--@huntingState : 1 --> closed , 0-->still running, (-1)--> ignore
			if(@huntingState=1)
			begin
				--reset value
				set @joined_sql='' 
				set @fullQuery=''
				
					set @joined_sql+=' inner join UnitHasGame ug
									on ug.UnitID=u.unitId 
									and ug.GameID='+cast(@huntingStateGameId as varchar)+'
									and ug.IsActive=1
									inner join GameHasAnimal gha
									on ug.GameID=gha.GameID
									and gha.AnimalTypeID='+cast(@huntingStateAnimalId as varchar)+'
									and gha.IsActive=1
									left outer join CompleteHunting ch
									on ch.UnitId=u.unitId
									and ch.GameId='''+cast(@huntingStateGameId as varchar)+''' and ch.AnimalId='''+cast(@huntingStateAnimalId as varchar)+'''
									and ch.HuntingYear='''+cast(@currentHuntingYear as varchar)+''' 
									group by v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,ISNULL(ch.IsActive,0),u.unitId,u.unit
									having ISNULL(ch.IsActive,0)=1'
				
				if(@getTeamLeaders=1 and @singleUser_sql<>'')
				begin
					set @fullQuery=@dynamic_sql+@joined_sql+@singleUser_sql+@joined_sql
				end
				else
				begin
					set @fullQuery=@dynamic_sql+@joined_sql
				end
				
				insert into @user_tbl EXEC sp_executesql @fullQuery
				
			end
			else if(@huntingState=0)
			begin
				--reset value
				set @joined_sql='' 
				set @fullQuery=''
				
				set @joined_sql+='inner join UnitHasGame ug
									on ug.UnitID=u.unitId 
									and ug.GameID='+cast(@huntingStateGameId as varchar)+'
									and ug.IsActive=1
									inner join GameHasAnimal gha
									on ug.GameID=gha.GameID
									and gha.AnimalTypeID='+cast(@huntingStateAnimalId as varchar)+'
									and gha.IsActive=1
									 left outer join CompleteHunting ch
									on ch.UnitId=u.unitId
									and ch.GameId='''+cast(@huntingStateGameId as varchar)+''' and ch.AnimalId='''+cast(@huntingStateAnimalId as varchar)+'''
									and ch.HuntingYear='''+cast(@currentHuntingYear as varchar)+''' 
									group by v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,ISNULL(ch.IsActive,0),u.unitId,u.unit
									having ISNULL(ch.IsActive,0)=0'
				
				if(@getTeamLeaders=1 and @singleUser_sql<>'')
				begin
					set @fullQuery=@dynamic_sql+@joined_sql+@singleUser_sql+@joined_sql
				end
				else
				begin
					set @fullQuery=@dynamic_sql+@joined_sql
				end
				
				insert into @user_tbl EXEC sp_executesql @fullQuery
				
			end
			
			if(@getTeamsWithInvalidReports=1)
			begin
				--reset value
				set @joined_sql='' 
				set @fullQuery=''
                 -- for hjort(deer) invalid shot count measured with hunting place other than date with unit
				if(@invalidReportsAnimalId =2 and @invalidReportGameId=3)
				begin
				set @joined_sql+='  inner join UnitHasGame ug
									on ug.UnitID=u.unitId 
										and ug.GameID='+cast(@invalidReportGameId as varchar)+'
										and ug.IsActive=1
									left outer join (
										select a.HuntingTeamID,
												SUM( case when ISNULL(obsactions.ActionDate,'''')='''' then 1 else 0 end) as InvalidReportCount
										from AnimalAction a
										inner join #unit_tbl u
										on u.typeId=6 and a.HuntingTeamID=u.unitId 
												and cast(a.ActionDate as date) >='''+cast(@currentHuntingYear as varchar)+'-04-01'' 
												and cast(a.ActionDate as date) <='''+cast((@currentHuntingYear+1) as varchar)+'-03-31''
												and a.IsActive=1 and a.IsShot=1
												and a.AnimalTypeId='''+cast(@invalidReportsAnimalId as varchar)+'''
												and a.GameID='''+cast(@invalidReportGameId as varchar)+'''
										inner join UnitHasGame ug
										on ug.UnitID=u.unitId 
											and ug.GameID='+cast(@invalidReportGameId as varchar)+'
											and ug.IsActive=1
										left outer join
										(
											select a.HuntingTeamID,cast(a.ActionDate as date) as ActionDate, a.IsActionAtForest
											from AnimalAction a
											inner join #unit_tbl u
											on u.typeId=6
												and a.HuntingTeamID=u.unitId 
												and cast(a.ActionDate as date) >='''+cast(@currentHuntingYear as varchar)+'-04-01'' 
												and cast(a.ActionDate as date) <='''+cast((@currentHuntingYear+1) as varchar)+'-03-31''
												and a.IsActive=1
												and a.IsShot=0 /*get observation reports for the date*/
												and a.AnimalTypeId='''+cast(@invalidReportsAnimalId as varchar)+'''
												and a.GameID='''+cast(@invalidReportGameId as varchar)+'''
											inner join UnitHasGame ug
											on ug.UnitID=u.unitId 
												and ug.GameID='+cast(@invalidReportGameId as varchar)+'
												and ug.IsActive=1
											group by a.HuntingTeamID,cast(a.ActionDate as date), a.IsActionAtForest
										) as obsactions
										on cast(a.ActionDate as date)=cast(obsactions.ActionDate as date) 
											and a.HuntingTeamID=obsactions.HuntingTeamID and  a.IsActionAtForest=obsactions.IsActionAtForest
										group by a.HuntingTeamID,  a.IsActionAtForest) as invalidtbl
									on invalidtbl.HuntingTeamID=u.unitId
									group by v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,ISNULL(invalidtbl.InvalidReportCount,0),u.unitId,u.unit
									having ISNULL(invalidtbl.InvalidReportCount,0)>0'
						end
						else
						begin
							set @joined_sql+='  inner join UnitHasGame ug
									on ug.UnitID=u.unitId 
										and ug.GameID='+cast(@invalidReportGameId as varchar)+'
										and ug.IsActive=1
									left outer join (
										select a.HuntingTeamID,
												SUM( case when ISNULL(obsactions.ActionDate,'''')='''' then 1 else 0 end) as InvalidReportCount
										from AnimalAction a
										inner join #unit_tbl u
										on u.typeId=6 and a.HuntingTeamID=u.unitId 
												and cast(a.ActionDate as date) >='''+cast(@currentHuntingYear as varchar)+'-04-01'' 
												and cast(a.ActionDate as date) <='''+cast((@currentHuntingYear+1) as varchar)+'-03-31''
												and a.IsActive=1 and a.IsShot=1
												and a.AnimalTypeId='''+cast(@invalidReportsAnimalId as varchar)+'''
												and a.GameID='''+cast(@invalidReportGameId as varchar)+'''
										inner join UnitHasGame ug
										on ug.UnitID=u.unitId 
											and ug.GameID='+cast(@invalidReportGameId as varchar)+'
											and ug.IsActive=1
										left outer join
										(
											select a.HuntingTeamID,cast(a.ActionDate as date) as ActionDate
											from AnimalAction a
											inner join #unit_tbl u
											on u.typeId=6
												and a.HuntingTeamID=u.unitId 
												and cast(a.ActionDate as date) >='''+cast(@currentHuntingYear as varchar)+'-04-01'' 
												and cast(a.ActionDate as date) <='''+cast((@currentHuntingYear+1) as varchar)+'-03-31''
												and a.IsActive=1
												and a.IsShot=0 /*get observation reports for the date*/
												and a.AnimalTypeId='''+cast(@invalidReportsAnimalId as varchar)+'''
												and a.GameID='''+cast(@invalidReportGameId as varchar)+'''
											inner join UnitHasGame ug
											on ug.UnitID=u.unitId 
												and ug.GameID='+cast(@invalidReportGameId as varchar)+'
												and ug.IsActive=1
											group by a.HuntingTeamID,cast(a.ActionDate as date)
										) as obsactions
										on cast(a.ActionDate as date)=cast(obsactions.ActionDate as date) 
											and a.HuntingTeamID=obsactions.HuntingTeamID
										group by a.HuntingTeamID ) as invalidtbl
									on invalidtbl.HuntingTeamID=u.unitId
									group by v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,ISNULL(invalidtbl.InvalidReportCount,0),u.unitId,u.unit
									having ISNULL(invalidtbl.InvalidReportCount,0)>0'
						end
									
				if(@getTeamLeaders=1 and @singleUser_sql<>'')
				begin
					set @fullQuery=@dynamic_sql+@joined_sql+@singleUser_sql+@joined_sql
				end
				else
				begin
					set @fullQuery=@dynamic_sql+@joined_sql
				end
				
				insert into @user_tbl EXEC sp_executesql @fullQuery

			end
			
			if(@getTeamsWithMultiObsReports=1)
			begin
				--reset value
				set @joined_sql='' 
				set @fullQuery=''
				
				set @joined_sql+='	inner join UnitHasGame ug
									on ug.UnitID=u.unitId 
										and ug.GameID='+cast(@multiObsReportGameId as varchar)+'
										and ug.IsActive=1
									left outer join AnimalAction a 
									on a.HuntingTeamID=u.unitId and a.IsActive=1 and a.IsShot=0
										and cast(a.ActionDate as date) >='''+cast(@currentHuntingYear as varchar)+'-04-01'' 
										and cast(a.ActionDate as date) <='''+cast((@currentHuntingYear+1) as varchar)+'-03-31''
										and a.AnimalTypeId='''+cast(@multiObsReportsAnimalId as varchar)+'''
										and a.GameID='''+cast(@multiObsReportGameId as varchar)+'''
									left outer join
									(
										select a.HuntingTeamID,cast(a.ActionDate as date) as ActionDate,COUNT(a.ActionId) as ReportsCount
										from AnimalAction a
										inner join #unit_tbl u
										on u.typeId=6
											and a.HuntingTeamID=u.unitId 
											and cast(a.ActionDate as date) >='''+cast(@currentHuntingYear as varchar)+'-04-01'' 
											and cast(a.ActionDate as date) <='''+cast((@currentHuntingYear+1) as varchar)+'-03-31''
											and a.IsActive=1
											and a.IsShot=0 /*get observation reports for the date*/
											and a.AnimalTypeId='''+cast(@multiObsReportsAnimalId as varchar)+'''
											and a.GameID='''+cast(@multiObsReportGameId as varchar)+'''
										inner join UnitHasGame ug
										on ug.UnitID=u.unitId 
											and ug.GameID='+cast(@multiObsReportGameId as varchar)+'
											and ug.IsActive=1
										group by a.HuntingTeamID,cast(a.ActionDate as date)
									) as ReportCount
									on cast(a.ActionDate as date)=ReportCount.ActionDate 
											and a.HuntingTeamID=ReportCount.HuntingTeamID
									group by v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,ISNULL(ReportCount.ReportsCount,0),u.unitId,u.unit
									having ISNULL(ReportCount.ReportsCount,0)>1 --get when there are multiple reports per day'
				
				if(@getTeamLeaders=1 and @singleUser_sql<>'')
				begin
					set @fullQuery=@dynamic_sql+@joined_sql+@singleUser_sql+@joined_sql
				end
				else
				begin
					set @fullQuery=@dynamic_sql+@joined_sql
				end
				
				insert into @user_tbl EXEC sp_executesql @fullQuery
				
			end
			
		end
	end
	
	--users other than hunters
	if(@getAllUpperUsers=1 or @getHeadUpperUsers=1 or @getReportingUpperUsers =1 or @getMunicipalityUpperUsers=1 or @getExporterUpperUsers=1 or @getGuestUpperUsers=1 or @getGeneralUpperUsers =1 )
	begin 
		
		--reset value
		set @dynamic_sql=''
		set @condition=''
		
		if(@getAllUpperUsers=1)
		begin	
						
			set @dynamic_sql+=' select distinct v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,-1/*unitId*/,''''/*unit*/,-1/*msgId*/
								from UnitHasUsers uu
								inner join #unit_tbl u
								on uu.UnitID=u.unitId and uu.IsActive=1 and u.typeId<>6
								inner join ViltraUser v
								on v.UserID=uu.UserID and v.IsActive=1 and v.IsActiveUser=1'
			
			if(@exceptListStr<>'')
			begin 
				set @dynamic_sql+=' and v.UserID not in ('+@exceptListStr+')'			
			end
			
		end
		else if(@getHeadUpperUsers=1 or @getReportingUpperUsers =1 or @getMunicipalityUpperUsers=1 or @getExporterUpperUsers=1 or  @getGuestUpperUsers=1 or @getGeneralUpperUsers =1)
		begin 
			
			--space infront is required inorder to keep the query without ovelapping with previously assigned strings
			if(@getHeadUpperUsers=1)
			begin
				set @condition+=' uu.IsHead=1 or'
			end
			
			if(@getReportingUpperUsers=1)
			begin
				set @condition+=' uu.IsReporter=1 or'
			end
			
			if(@getMunicipalityUpperUsers=1)
			begin
				set @condition+=' uu.IsMunicipalityUser=1 or'
			end

				if(@getExporterUpperUsers=1)
			begin
				set @condition+=' uu.IsExporter=1 or'
			end

			if(@getGuestUpperUsers=1)
			begin
				set @condition+=' uu.IsGuest=1 or'
			end
			--users who are not included with any of the above roles	
			if(@getGeneralUpperUsers=1)
			begin
				set @condition+=' (uu.IsHead=0 and uu.IsReporter=0 and uu.IsMunicipalityUser=0 and uu.IsExporter=0 and uu.IsGuest=0)'
			end
			--remove 'or' condition added at the end
			else if(@condition<>'')
			begin
				set @condition=	LEFT (@condition, LEN(@condition)-2)
			end
						
			set @dynamic_sql+=' select distinct v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,-1/*unitId*/,''''/*unit*/,-1/*msgId*/
								from UnitHasUsers uu
								inner join #unit_tbl u
								on uu.UnitID=u.unitId and uu.IsActive=1 and u.typeId<>6'
						
			if(@condition<>'')
			begin
				set @dynamic_sql+=' and ( '+@condition+' )'
			end
					
			set @dynamic_sql+=' inner join ViltraUser v
								on v.UserID=uu.UserID and v.IsActive=1 and v.IsActiveUser=1'
			
			if(@exceptListStr<>'')
			begin 
				set @dynamic_sql+=' and v.UserID not in ('+@exceptListStr+')'			
			end
			
		end
			
		insert into @user_tbl EXEC sp_executesql @dynamic_sql		
		
	end
	
	--filters on landowners
	if(@getAllLandOwners=1 or @getHeadLandOwners=1 or @getReportingLandOwners=1 or @getGeneralLandOwners=1)
	begin
	
		--reset value
		set @dynamic_sql=''
		set @condition=''
		
		if(@getAllLandOwners=1)
		begin	
		
			set @dynamic_sql+='select distinct v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,-1/*unitId*/,''''/*unit*/,-1/*msgId*/
								from #unit_tbl u
								inner join LandUnit lu
								on u.unitId=lu.UnitId
								inner join Land l
								on l.LandId=lu.LandId and l.IsActive=1
								inner join LandOwner lo
								on lo.LandId=l.LandId and lo.IsActive=1
								inner join ViltraUser v
								on v.UserID=lo.SystemUserId and v.IsActive=1 and v.IsActiveUser=1'
			
			if(@exceptListStr<>'')
			begin 
				set @dynamic_sql+=' and v.UserID not in ('+@exceptListStr+')'			
			end
			
			set @dynamic_sql+=' union all
								
								/*get users who are landowners whose lands are not created yet*/
								select distinct v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,-1/*unitId*/,''''/*unit*/,-1/*msgId*/
								from #unit_tbl u
								inner join UsersLandUnitWithoutLand uwl
								on uwl.LandUnitId=u.unitId and uwl.IsActive=1
								--inner join UnitHasUsers uu
								--on uwl.LandUnitId=uu.UnitID 
								--	and uwl.UserSysId=uu.UserID 
								--	and uu.IsActive=1
								inner join ViltraUser v
								on v.UserID=uwl.UserSysId and v.IsActive=1 
									and v.IsActiveUser=1 and v.IsLandOwner=1'
			
			if(@exceptListStr<>'')
			begin 
				set @dynamic_sql+=' and v.UserID not in ('+@exceptListStr+')'			
			end
			
		end
		else if(@getHeadLandOwners=1 or @getReportingLandOwners =1 or @getGeneralLandOwners =1)
		begin 
			
			--space infront is required inorder to keep the query without ovelapping with previously assigned strings
			if(@getHeadLandOwners=1)
			begin
				set @condition+=' uu.IsHead=1 or'
			end
			
			if(@getReportingLandOwners=1)
			begin
				set @condition+=' uu.IsReporter=1 or'
			end
			
			if(@getGeneralLandOwners=1)
			begin
				set @condition+=' (uu.IsReporter=0 and uu.IsHead=0)'
			end
			--remove 'or' condition added at the end
			else if(@condition<>'')
			begin
				set @condition=	LEFT (@condition, LEN(@condition)-2)
			end
			
			set @dynamic_sql+='select distinct v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,-1/*unitId*/,''''/*unit*/,-1/*msgId*/
								from #unit_tbl u
								inner join LandUnit lu
								on u.unitId=lu.UnitId
								inner join Land l
								on l.LandId=lu.LandId and l.IsActive=1
								inner join LandOwner lo
								on lo.LandId=l.LandId and lo.IsActive=1								
								inner join UnitHasUsers uu
								on uu.UserID=lo.SystemUserId and uu.IsActive=1'						
									
			if(@condition<>'')
			begin
				set @dynamic_sql+=' and ( '+@condition+' )'
			end
					
			set @dynamic_sql+=' inner join ViltraUser v
								on v.UserID=uu.UserID and v.IsActive=1 and v.IsActiveUser=1'
								
			if(@exceptListStr<>'')
			begin 
				set @dynamic_sql+=' and v.UserID not in ('+@exceptListStr+')'			
			end
								
			set @dynamic_sql+=' union all
								
								/*get users who are landowners whose lands are not created yet*/
								select distinct v.UserID,v.DnnUserID,v.UserName,v.Email,v.FirstName,v.LastName,-1/*unitId*/,''''/*unit*/,-1/*msgId*/
								from #unit_tbl u
								inner join UsersLandUnitWithoutLand uwl
								on uwl.LandUnitId=u.unitId and uwl.IsActive=1
								inner join UnitHasUsers uu
								on uwl.LandUnitId=uu.UnitID 
									and uwl.UserSysId=uu.UserID 
									and uu.IsActive=1'
			
			if(@condition<>'')
			begin
				set @dynamic_sql+=' and ( '+@condition+' )'
			end
			
			set @dynamic_sql+=' inner join ViltraUser v
								on v.UserID=uu.UserID and v.IsActive=1 
									and v.IsActiveUser=1 and v.IsLandOwner=1'
			
			if(@exceptListStr<>'')
			begin 
				set @dynamic_sql+=' and v.UserID not in ('+@exceptListStr+')'			
			end
			
		end
				
		insert into @user_tbl EXEC sp_executesql @dynamic_sql
	
	end
	
	--if @doMail property is set to true then process posting message to users
	if(@doMail=1)
	begin
	
		declare @inboxId int =(select FolderId from MailBoxFolders where IsInbox=1)
		--cursor related variables
		declare @udnnId int,@uuId int
		
		DECLARE db_cursor CURSOR FOR  
		-- there can be multiple rows for same user since they can be in multiple units
		select distinct uDnnId,unitId
		from @user_tbl

		OPEN db_cursor   
		FETCH NEXT FROM db_cursor INTO @udnnId,@uuId  

		WHILE @@FETCH_STATUS = 0  
		BEGIN  
			--add to inbox 
			insert into MailBoxUsersMail
			(MessageId, OwnerDnnId, ReceivedOn, IsRead, IsActive, FolderId,OwnerUnitId, IsInfo, IsDocSign)
			values 
			(@messageId,@udnnId,SWITCHOFFSET(SYSDATETIMEOFFSET(),@gmt),0,1,@inboxId,(case when ISNULL(@uuId,-1) >0 then @uuId else null end), 0, 0)
			
			--will be use to send the email notification
			update @user_tbl
			set msgId=SCOPE_IDENTITY()
			where uDnnId=@udnnId and unitId=@uuId

			FETCH NEXT FROM db_cursor INTO @udnnId,@uuId   
		END   

		CLOSE db_cursor   
		DEALLOCATE db_cursor
	
	end
	
	--return user list
	--NOTE: there can be multiple rows for same user since they can be in multiple units
	select distinct * from @user_tbl
		
	--removing temp table declared at the beginning
	drop table #unit_tbl
end

/*
	exec AssignMailToFilteredUsersInbox_SP 
		1/*@messageId*/,
		'+05:30'/*@gmt*/,
		
		0/*@getAllLandOwners*/,
		0/*@getHeadLandOwners*/,
		0/*@getReportingLandOwners*/,
		0/*@getGeneralLandOwners*/,
		
		0/*@getAllHunters*/,
		0/*@getHeadHunters*/,
		0/*@getReportingHunters*/,
		1/*@getTeamLeaders*/,
		0/*@getGeneralHunters*/,
		0/*@getZeroReportingTeams*/,
		0/*@zeroRepType*/,
		0/*@zeroRepGameId*/,
		0/*@zeroRepAnimalId*/,
		0/*@getTeamsWithMissingWeights*/,
		0/*@mwGameId*/,
		0/*@mwAnimalId*/,
		0/*@getTeamsInCommonQuota*/,
		0/*@quotaAnimalId*/,
		0/*@quotaGameId*/,
		1/*@huntingState (-1 when not selected)*/,
		1/*@huntingStateGameId int*/,
		1/*@huntingStateAnimalId int*/,
		1/*@getTeamsWithInvalidReports*/,
		2/*@invalidReportsAnimalId*/,
		3/*@invalidReportGameId*/,
		1/*@getTeamsWithMultiObsReports*/,
		1/*@multiObsReportsAnimalId*/,
		1/*@multiObsReportGameId*/,
		
		0/*@getAllUpperUsers*/,
		0/*@getHeadUpperUsers*/,
		0/*@getReportingUpperUsers*/,
		0/*@getMunicipalityUpperUsers*/,
		1/*@getExporterUpperUsers*/,
		0/*@getGuestUpperUsers*/,
		0/*@getGeneralUpperUsers*/,
		
		'3606'/*@unitListstr*/,
		1/*@getAllChildren*/,
		''/*@exceptListStr*/,
		0/*@doMail*/
*/

